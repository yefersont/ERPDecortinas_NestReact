import { Injectable } from '@nestjs/common';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CotizacionesService {

  // Buscar todas las cotizaciones
  findAll() {
    return prisma.cotizaciones.findMany({
      include: {
        cliente: true,
        detalles: true,
        ventas: true,
      },
    });
  }

  // Buscar una cotización por ID
  findOne(id: number) {
    return prisma.cotizaciones.findUnique({
      where: { idCotizacion: id },
      include: {
        cliente: true,
        detalles: true,
        ventas: true,
      },
    });
  }

  // Crear una cotización sin detalles
  async create(data: CreateCotizacioneDto) {
    return prisma.cotizaciones.create({
      data: {
        idCliente: data.idCliente,
        valor_total: data.valor_total,
        fecha: new Date(data.fecha),
      },
    });
  }

  // Actualizar una cotización
  update(id: number, updateCotizacioneDto: UpdateCotizacioneDto) {
    return prisma.cotizaciones.update({
      where: { idCotizacion: id },
      data: updateCotizacioneDto,
    });
  }

  // Eliminar una cotización
  remove(id: number) {
    return prisma.cotizaciones.delete({
      where: { idCotizacion: id },
    });
  }
}
