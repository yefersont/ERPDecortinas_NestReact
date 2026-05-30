import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';
import { CreateCotizacionWithDetailsDto } from './dto/create-cotizacion-with-details.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CotizacionesService {
  constructor(private prisma: PrismaService) { }

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

      // 2. Crear todos los detalles calculando su costo
      const detallesCreados = await Promise.all(
        data.detalles.map(async (detalle) => {
          const costoTipoProducto = await tx.costoTipoProducto.findFirst({
            where: {
              idTipo_producto: detalle.idTipo_producto,
              fecha_fin: null,
            },
          });

          if (!costoTipoProducto) {
            throw new Error(
              `No existe un costo vigente para el tipo de producto ${detalle.idTipo_producto}`,
            );
          }

          const costoCalculado =
            Number(detalle.ancho) *
            Number(detalle.alto) *
            Number(costoTipoProducto.costo_base);

          return tx.detalleCotizacion.create({
            data: {
              idCotizacion: cotizacion.idCotizacion,
              idTipo_producto: detalle.idTipo_producto,
              ancho: detalle.ancho,
              alto: detalle.alto,
              precio: detalle.precio,
              costo_calculado: Math.round(costoCalculado),
            },
          });
        }),
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
    const cotizaciones = await this.prisma.cotizaciones.findMany({
      orderBy: {
        fecha: 'desc',
      },
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

    return cotizaciones.map((cotizacion) => {
      const detalles = cotizacion.detalles.map((detalle) => ({
        ...detalle,
        utilidad:
          Number(detalle.precio) -
          Number(detalle.costo_calculado ?? 0),
      }));

      const utilidadTotal = detalles.reduce(
        (acc, detalle) => acc + detalle.utilidad,
        0,
      );

      return {
        ...cotizacion,
        detalles,
        utilidad_total: utilidadTotal,
      };
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
      throw new NotFoundException(
        `Cotización con ID ${id} no existe`,
      );
    }

    const detalles = cotizacion.detalles.map((detalle) => ({
      ...detalle,
      utilidad:
        Number(detalle.precio) -
        Number(detalle.costo_calculado ?? 0),
    }));

    const utilidadTotal = detalles.reduce(
      (acc, detalle) => acc + detalle.utilidad,
      0,
    );

    return {
      ...cotizacion,
      detalles,
      utilidad_total: utilidadTotal,
    };
  }

  // Pendiente de revisar si realmente se necesita.
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

  // Actualizar cotización con detalles en una transacción
  async updateWithDetails(id: number, data: CreateCotizacionWithDetailsDto) {
    return this.prisma.$transaction(async (tx) => {

      const exists = await tx.cotizaciones.findUnique({
        where: { idCotizacion: id },
      });

      if (!exists) {
        throw new NotFoundException(
          `Cotización con ID ${id} no existe`,
        );
      }

      await tx.detalleCotizacion.deleteMany({
        where: { idCotizacion: id },
      });

      const detallesCreados = await Promise.all(
        data.detalles.map(async (detalle) => {

          const costo = await tx.costoTipoProducto.findFirst({
            where: {
              idTipo_producto: detalle.idTipo_producto,
              fecha_fin: null,
            },
          });

          const costoBase = Number(costo?.costo_base ?? 0);

          const costoCalculado = Math.round(
            Number(detalle.ancho) *
            Number(detalle.alto) *
            costoBase,
          );

          return tx.detalleCotizacion.create({
            data: {
              idCotizacion: id,
              idTipo_producto: detalle.idTipo_producto,
              ancho: detalle.ancho,
              alto: detalle.alto,
              precio: detalle.precio,
              costo_calculado: costoCalculado,
            },
          });
        }),
      );

      const valorTotal = detallesCreados.reduce(
        (acc, detalle) => acc + Number(detalle.precio),
        0,
      );

      const cotizacionActualizada = await tx.cotizaciones.update({
        where: { idCotizacion: id },
        data: {
          fecha: new Date(data.fecha),
          valor_total: valorTotal,
        },
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

      return cotizacionActualizada;
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

    await this.prisma.detalleCotizacion.deleteMany({
      where: { idCotizacion: id },
    });

    await this.prisma.ventas.deleteMany({
      where: { idCotizacion: id },
    });

    const deleted = await this.prisma.cotizaciones.delete({
      where: { idCotizacion: id },
    });

    return {
      message: 'Cotización eliminada correctamente',
      data: deleted,
    };
  }
}
