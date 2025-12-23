import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';
import { CreateCotizacionWithDetailsDto } from './dto/create-cotizacion-with-details.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CotizacionesService {
  constructor(private prisma: PrismaService) {}

  // Crear cotización con detalles en una transacción
  async createWithDetails(data: CreateCotizacionWithDetailsDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear la cotización con valor_total en 0 inicialmente
      const cotizacion = await tx.cotizaciones.create({
        data: {
          idCliente: data.idCliente,
          fecha: new Date(data.fecha),
          valor_total: 0,
        },
      });

      // 2. Crear todos los detalles de cotización
      const detallesCreados = await Promise.all(
        data.detalles.map((detalle) =>
          tx.detalleCotizacion.create({
            data: {
              idCotizacion: cotizacion.idCotizacion,
              idTipo_producto: detalle.idTipo_producto,
              ancho: detalle.ancho,
              alto: detalle.alto,
              precio: detalle.precio,
            },
          }),
        ),
      );

      // 3. Calcular el valor total sumando los precios de los detalles
      const valorTotal = detallesCreados.reduce(
        (acc, detalle) => acc + Number(detalle.precio),
        0,
      );

      // 4. Actualizar la cotización con el valor total correcto
      const cotizacionActualizada = await tx.cotizaciones.update({
        where: { idCotizacion: cotizacion.idCotizacion },
        data: { valor_total: valorTotal },
        include: {
          cliente: true,
          detalles: {
            include: {
              tipoProducto: true,
            },
          },
        },
      });

      return cotizacionActualizada;
    });
  }

  // Buscar todas las cotizaciones
  async findAll() {
    return this.prisma.cotizaciones.findMany({
      include: {
        cliente: true,
        detalles: {
          include: {
            tipoProducto: true,
          },
        },
        ventas: true,
      },
    });
  }

  // Buscar una cotización por ID
  async findOne(id: number) {
    const cotizacion = await this.prisma.cotizaciones.findUnique({
      where: { idCotizacion: id },
      include: {
        cliente: true,
        detalles: {
          include: {
            tipoProducto: true,
          },
        },
        ventas: true,
      },
    });

    if (!cotizacion) {
      throw new NotFoundException(`Cotización con ID ${id} no existe`);
    }

    return cotizacion;
  }

  // Crear una cotización sin detalles (mantener por compatibilidad)
  async create(data: CreateCotizacioneDto) {
    return this.prisma.cotizaciones.create({
      data: {
        idCliente: data.idCliente,
        valor_total: data.valor_total,
        fecha: new Date(data.fecha),
      },
    });
  }

  // Actualizar una cotización
  async update(id: number, updateCotizacioneDto: UpdateCotizacioneDto) {
    const exists = await this.prisma.cotizaciones.findUnique({
      where: { idCotizacion: id },
    });

    if (!exists) {
      throw new NotFoundException(`Cotización con ID ${id} no existe`);
    }

    return this.prisma.cotizaciones.update({
      where: { idCotizacion: id },
      data: updateCotizacioneDto,
    });
  }

  // Eliminar una cotización
  async remove(id: number) {
    const exists = await this.prisma.cotizaciones.findUnique({
      where: { idCotizacion: id },
    });

    if (!exists) {
      throw new NotFoundException(`Cotización con ID ${id} no existe`);
    }

    return this.prisma.cotizaciones.delete({
      where: { idCotizacion: id },
    });
  }
}
