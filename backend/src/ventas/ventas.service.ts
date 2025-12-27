import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { EstadoPago } from '@prisma/client';

@Injectable()
export class VentasService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreateVentaDto) {
    return await this.prisma.$transaction(async (tx) => {
      const cotizacion = await tx.cotizaciones.findUnique({
        where: { idCotizacion: data.idCotizacion },
        include: { detalles: true },
      });

      if (!cotizacion) {
        throw new NotFoundException(
          `La cotización con ID ${data.idCotizacion} no existe`,
        );
      }

      if (cotizacion.detalles.length === 0) {
        throw new Error(
          'No se puede registrar la venta porque la cotización no tiene detalles',
        );
      }

      const total = Number(cotizacion.valor_total);
      const abono = Number(data.abono_inicial);

      // 🔎 Validaciones de negocio
      if (isNaN(abono) || abono <= 0) {
        throw new BadRequestException('El abono inicial debe ser mayor a 0');
      }

      if (abono > total) {
        throw new BadRequestException(
          `El abono inicial no puede ser mayor al total (${total})`,
        );
      }

      const saldoPendiente = total - abono;

      const venta = await tx.ventas.create({
        data: {
          fecha_venta: new Date(data.fecha_venta),
          idCotizacion: data.idCotizacion,
          total,
          saldo_pendiente: saldoPendiente,
          estado_pago: saldoPendiente === 0 ? 'PAGADO' : 'PENDIENTE',
        },
      });

      await tx.deudores.create({
        data: {
          idVenta: venta.idVenta,
          abono,
          fecha_abono: new Date(),
        },
      });

      return {
        message: 'Venta registrada correctamente',
        data: {
          ...venta,
          abono_inicial: abono,
          saldo_pendiente: saldoPendiente,
        },
      };
    });
  }


  
  // FIND ALL
  async findAll() {
    const ventas = await this.prisma.ventas.findMany({
      orderBy: {
        fecha_venta: "desc",
      },
      include: {
        cotizacion: {
          include: {
            cliente: true,
          },
        },
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
