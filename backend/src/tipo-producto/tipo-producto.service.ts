import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

const prisma = new PrismaClient();

@Injectable()
export class TipoProductoService {

  // Buscar todos los tipos de producto
  findAll() {
    return prisma.tipo_producto.findMany({
      include: {
        cotizaciones: true,
      },
    });
  }

  // Buscar un tipo de producto por ID
  findOne(id: number) {
    return prisma.tipo_producto.findUnique({
      where: { idTipo_producto: id },
      include: {
        cotizaciones: true,
      },
    });
  }

  // Crear tipo de producto
  create(data: CreateTipoProductoDto) {
    return prisma.tipo_producto.create({
      data: {
        nombre_tp: data.nombre_tp,
      },
    });
  }

  // Actualizar tipo de producto
  update(id: number, data: UpdateTipoProductoDto) {
    return prisma.tipo_producto.update({
      where: { idTipo_producto: id },
      data,
    });
  }

  // Eliminar tipo de producto
  remove(id: number) {
    return prisma.tipo_producto.delete({
      where: { idTipo_producto: id },
    });
  }
}
