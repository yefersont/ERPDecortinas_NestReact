import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeudoreDto } from './dto/create-deudore.dto';
import { UpdateDeudoreDto } from './dto/update-deudore.dto';

@Injectable()
export class DeudoresService {
  constructor(private prisma: PrismaService) {}

  // CREATE


  async create(data: CreateDeudoreDto) {
    // Buscar la venta asociada
    const venta = await this.prisma.ventas.findUnique({
      where: { idVenta: data.idVenta },
    });

    if (!venta) {
      throw new NotFoundException(
        `La venta con ID ${data.idVenta} no existe`,
      );
    }

    // Validaciones
    if (data.abono <= 0) {
      throw new BadRequestException('El abono debe ser mayor a 0');
    }

    // Convertir Decimal a number para comparación
    const saldoPendiente = Number(venta.saldo_pendiente);

    if (data.abono > saldoPendiente) {
      throw new BadRequestException (
        `El abono no puede ser mayor al saldo pendiente (${saldoPendiente})`,
      );
    }

    // Crear registro de deudor (abono)
    const deudor = await this.prisma.deudores.create({
      data: {
        abono: data.abono,
        fecha_abono: data.fecha_abono,
        venta: {
          connect: { idVenta: data.idVenta },
        },
      },
    });

    // Actualizar saldo pendiente y estado de la venta
    const nuevoSaldo = saldoPendiente - data.abono;
    await this.prisma.ventas.update({
      where: { idVenta: data.idVenta },
      data: {
        saldo_pendiente: nuevoSaldo,
        estado_pago: nuevoSaldo === 0 ? 'PAGADO' : 'PENDIENTE',
      },
    });

    return {
      message:
        nuevoSaldo === 0
          ? 'Abono registrado correctamente. La venta está totalmente pagada.'
          : `Abono registrado correctamente. Saldo pendiente: ${nuevoSaldo}`,
      data: deudor,
    };
  }


  // FIND ALL
  async findAll() {
    const deudores = await this.prisma.deudores.findMany({
      include: {
        venta: true,
      },
    });

    return {
      message: 'Listado de deudores obtenido correctamente',
      data: deudores,
    };
  }

  // FIND ONE
  async findOne(id: number) {
    const deudor = await this.prisma.deudores.findUnique({
      where: { idDeudor: id },
      include: {
        venta: true,
      },
    });

    if (!deudor) {
      throw new BadRequestException(`Deudor con ID ${id} no existe`);
    }

    return {
      message: 'Deudor encontrado',
      data: deudor,
    };
  }

  // UPDATE
  async update(id: number, data: UpdateDeudoreDto) {
    const deudorActual = await this.prisma.deudores.findUnique({
      where: { idDeudor: id },
      include: { venta: true },
    });

    if (!deudorActual) {
      throw new NotFoundException(`Deudor con ID ${id} no existe`);
    }

    // ⚠️ Validar que venga el abono
    if (data.abono === undefined) {
      throw new Error('El abono es obligatorio para actualizar');
    }

    if (data.abono <= 0) {
      throw new Error('El abono debe ser mayor a 0');
    }

    // Total abonado EXCLUYENDO el actual
    const otrosAbonos = await this.prisma.deudores.aggregate({
      where: {
        idVenta: deudorActual.idVenta,
        NOT: { idDeudor: id },
      },
      _sum: {
        abono: true,
      },
    });

    const totalAbonadoSinActual =
      otrosAbonos._sum.abono?.toNumber() || 0;

    const nuevoTotal = totalAbonadoSinActual + data.abono;

    // (Opcional) validar contra el total de la venta
    // if (nuevoTotal > deudorActual.venta.valor_total) {
    //   throw new Error('El total abonado supera el valor de la venta');
    // }

    const actualizado = await this.prisma.deudores.update({
      where: { idDeudor: id },
      data: {
        abono: data.abono,
        fecha_abono: data.fecha_abono ?? deudorActual.fecha_abono,
      },
    });

    return {
      message: 'Abono actualizado correctamente',
      data: actualizado,
    };
  }



  // DELETE
  async remove(id: number) {
    const exists = await this.prisma.deudores.findUnique({
      where: { idDeudor: id },
    });

    if (!exists) {
      throw new NotFoundException(`Deudor con ID ${id} no existe`);
    }

    const deleted = await this.prisma.deudores.delete({
      where: { idDeudor: id },
    });

    return {
      message: 'Deudor eliminado correctamente',
      data: deleted,
    };
  }
}
