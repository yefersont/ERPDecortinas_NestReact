import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreateVentaDto) {
    const venta = await this.prisma.ventas.create({
      data: {
        fecha_venta: new Date(data.fecha_venta),
        idCotizacion: data.idCotizacion,
      },
      include: {
        cotizacion: true,
      },
    });

    return {
      message: 'Venta creada correctamente',
      data: venta,
    };
  }

  // FIND ALL
  async findAll() {
    const ventas = await this.prisma.ventas.findMany({
      include: {
        cotizacion: true,
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

  // UPDATE
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
        fecha_venta: data.fecha_venta ? new Date(data.fecha_venta) : undefined,
        idCotizacion: data.idCotizacion,
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

    const deleted = await this.prisma.ventas.delete({
      where: { idVenta: id },
    });

    return {
      message: 'Venta eliminada correctamente',
      data: deleted,
    };
  }
}
