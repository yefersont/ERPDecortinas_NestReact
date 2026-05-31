import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMultipleDetallecotizacionDto } from './dto/create-multiple-detallecotizacion.dto';
import { CreateDetallecotizacionDto } from './dto/create-detallecotizacion.dto';
import { UpdateDetallecotizacionDto } from './dto/update-detallecotizacion.dto';


@Injectable()
export class DetallecotizacionService {
  constructor(private prisma: PrismaService) { }

  // create para varios detalles
  async createMultiple(dto: CreateMultipleDetallecotizacionDto) {
    const created = await Promise.all(
      dto.detalles.map(async (detalle) => {

        const costo = await this.prisma.costoTipoProducto.findFirst({
          where: {
            idTipo_producto: detalle.idTipo_producto,
            fecha_fin: null,
          },
        });

        if (!costo) {
          throw new NotFoundException(
            `No existe un costo vigente para el tipo de producto ${detalle.idTipo_producto}`,
          );
        }

        const costoCalculado = Math.round(
          Number(detalle.ancho) *
          Number(detalle.alto) *
          Number(costo.costo_base));

        return this.prisma.detalleCotizacion.create({
          data: {
            idCotizacion: detalle.idCotizacion,
            idTipo_producto: detalle.idTipo_producto,
            ancho: detalle.ancho,
            alto: detalle.alto,
            precio: detalle.precio,
            costo_calculado: costoCalculado,
          },
        });
      }),
    );

    // Asumiendo que todos los detalles pertenecen a la misma cotización
    if (dto.detalles.length > 0) {
      const idCotizacion = dto.detalles[0].idCotizacion;
      await this.actualizarValorTotalCotizacion(idCotizacion);
    }

    return {
      message: `${created.length} detalles creados correctamente`,
      data: created,
    };
  }

  async actualizarValorTotalCotizacion(idCotizacion: number) {
    const detalles = await this.prisma.detalleCotizacion.findMany({
      where: { idCotizacion },
    });

    const valorTotal = detalles.reduce((acc, d) => acc + Number(d.precio), 0);

    return this.prisma.cotizaciones.update({
      where: { idCotizacion },
      data: { valor_total: valorTotal },
    });
  }

  async findAll() {
    const detalles = await this.prisma.detalleCotizacion.findMany({
      include: {
        tipoProducto: true,
      },
    });

    const detallesConUtilidad = detalles.map((detalle) => ({
      ...detalle,
      utilidad:
        Number(detalle.precio) -
        Number(detalle.costo_calculado ?? 0),
    }));

    return detallesConUtilidad;
  }

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

  async update(
    id: number,
    data: UpdateDetallecotizacionDto,
  ) {
    const exists = await this.prisma.detalleCotizacion.findUnique({
      where: { idDetalle: id },
    });

    if (!exists) {
      throw new NotFoundException(
        `DetalleCotización con ID ${id} no existe`,
      );
    }

    // Tomar los valores nuevos o los actuales
    const ancho = data.ancho ?? Number(exists.ancho);
    const alto = data.alto ?? Number(exists.alto);
    const idTipoProducto =
      data.idTipo_producto ?? exists.idTipo_producto;

    // Buscar costo vigente del tipo de producto
    const costo = await this.prisma.costoTipoProducto.findFirst({
      where: {
        idTipo_producto: idTipoProducto,
        fecha_fin: null,
      },
      orderBy: {
        fecha_inicio: 'desc',
      },
    });

    if (!costo) {
      throw new NotFoundException(
        `No existe un costo vigente para el tipo de producto ${idTipoProducto}`,
      );
    }

    // Recalcular costo
    const costoCalculado = Math.round(
      ancho * alto * Number(costo.costo_base),
    );

    // Actualizar detalle
    return await this.prisma.detalleCotizacion.update({
      where: { idDetalle: id },
      data: {
        ...data,
        costo_calculado: costoCalculado,
      },
    });
  }

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
} 1
