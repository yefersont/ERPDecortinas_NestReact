import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { EstadoPago } from '@prisma/client';

@Injectable()
export class VentasService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreateVentaDto) {
    const cotizacion = await this.prisma.cotizaciones.findUnique({
      where: { idCotizacion: data.idCotizacion },
    });

    if (!cotizacion) {
      throw new NotFoundException(
        `La cotización con ID ${data.idCotizacion} no existe`,
      );
    }

    const total = Number(cotizacion.valor_total);

    // 3️⃣ Abono inicial (default 50 %)
    const abonoInicial =
      data.abono_inicial !== undefined
        ? data.abono_inicial
        : total / 2;

    if (abonoInicial > total) {
      throw new Error('El abono inicial no puede ser mayor al total');
    }

    // 4️⃣ Saldo pendiente
    const saldoPendiente = total - abonoInicial;

    // 5️⃣ Crear venta
    const venta = await this.prisma.ventas.create({
      data: {
        fecha_venta: new Date(data.fecha_venta),
        idCotizacion: data.idCotizacion,
        total,
        saldo_pendiente: saldoPendiente,
        estado_pago: saldoPendiente === 0 ? 'PAGADO' : 'PENDIENTE',
      },
    });

    // 6️⃣ Registrar abono inicial como deuda
    await this.prisma.deudores.create({
      data: {
        idVenta: venta.idVenta,
        abono: abonoInicial,
        fecha_abono: new Date(),
      },
    });

    return {
      message: 'Venta creada con abono inicial',
      data: venta,
    };
  }

  

  // FIND ALL
  async findAll() {
    const ventas = await this.prisma.ventas.findMany({
      include: {
        cotizacion: true,
        abonos: true,
      },
    });

    return {
      message: 'Lista de ventas obtenida correctamente',
      data: ventas,
    };
  }

  // FIND ONE
  async findOne(id: number) {
    const venta = await this.prisma.ventas.findUnique({
      where: { idVenta: id },
      include: {
        cotizacion: true,
        abonos: true,
      },
    });

    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no existe`);
    }

    return {
      message: 'Venta encontrada correctamente',
      data: venta,
    };
  }

  // UPDATE (solo datos básicos)
  async update(id: number, data: UpdateVentaDto) {
    const venta = await this.prisma.ventas.findUnique({
      where: { idVenta: id },
    });

    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no existe`);
    }

    const updated = await this.prisma.ventas.update({
      where: { idVenta: id },
      data: {
        fecha_venta: data.fecha_venta
          ? new Date(data.fecha_venta)
          : undefined,
      },
    });

    return {
      message: 'Venta actualizada correctamente',
      data: updated,
    };
  }

  // DELETE
  async remove(id: number) {
    const venta = await this.prisma.ventas.findUnique({
      where: { idVenta: id },
    });

    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no existe`);
    }

    await this.prisma.deudores.deleteMany({
      where: { idVenta: id },
    });

    const deleted = await this.prisma.ventas.delete({
      where: { idVenta: id },
    });

    return {
      message: 'Venta eliminada correctamente',
      data: deleted,
    };
  }
}
