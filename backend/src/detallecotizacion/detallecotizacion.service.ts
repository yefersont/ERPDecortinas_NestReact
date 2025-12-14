import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDetallecotizacionDto } from './dto/create-detallecotizacion.dto';
import { UpdateDetallecotizacionDto } from './dto/update-detallecotizacion.dto';

@Injectable()
export class DetallecotizacionService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreateDetallecotizacionDto) {
    const detalle = await this.prisma.detalleCotizacion.create({
      data: {
        idCotizacion: data.idCotizacion,
        idTipo_producto: data.idTipo_producto,
        ancho: data.ancho,
        alto: data.alto,
        precio: data.precio,
      },
    });

    return {
      message: 'Detalle de cotización creado correctamente',
      data: detalle,
    };
  }

  // FIND ALL
  async findAll() {
    const detalles = await this.prisma.detalleCotizacion.findMany({
      include: {
        tipoProducto: true,
      },
    });

    return {
      message: 'Listado de detalles de cotización',
      data: detalles,
    };
  }

  // FIND ONE
  async findOne(id: number) {
    const detalle = await this.prisma.detalleCotizacion.findUnique({
      where: { idDetalle: id },
      include: {
        tipoProducto: true,
      },
    });

    if (!detalle) {
      throw new NotFoundException(`DetalleCotización con ID ${id} no existe`);
    }

    return {
      message: 'Detalle de cotización encontrado',
      data: detalle,
    };
  }

  // UPDATE
  async update(id: number, data: UpdateDetallecotizacionDto) {
    const exists = await this.prisma.detalleCotizacion.findUnique({
      where: { idDetalle: id },
    });

    if (!exists) {
      throw new NotFoundException(`DetalleCotización con ID ${id} no existe`);
    }

    const updated = await this.prisma.detalleCotizacion.update({
      where: { idDetalle: id },
      data: { ...data },
    });

    return {
      message: 'Detalle de cotización actualizado correctamente',
      data: updated,
    };
  }

  // DELETE
  async remove(id: number) {
    const exists = await this.prisma.detalleCotizacion.findUnique({
      where: { idDetalle: id },
    });

    if (!exists) {
      throw new NotFoundException(`DetalleCotización con ID ${id} no existe`);
    }

    const deleted = await this.prisma.detalleCotizacion.delete({
      where: { idDetalle: id },
    });

    return {
      message: 'Detalle de cotización eliminado correctamente',
      data: deleted,
    };
  }
}
