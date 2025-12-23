import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMultipleDetallecotizacionDto } from './dto/create-multiple-detallecotizacion.dto';
import { CreateDetallecotizacionDto } from './dto/create-detallecotizacion.dto';
import { UpdateDetallecotizacionDto } from './dto/update-detallecotizacion.dto';


@Injectable()
export class DetallecotizacionService {
  constructor(private prisma: PrismaService) {}

  // create para varios detalles
  async createMultiple(dto: CreateMultipleDetallecotizacionDto) {
    const created = await Promise.all(
      dto.detalles.map((detalle) =>
        this.prisma.detalleCotizacion.create({
          data: {
            idCotizacion: detalle.idCotizacion,
            idTipo_producto: detalle.idTipo_producto,
            ancho: detalle.ancho,
            alto: detalle.alto,
            precio: detalle.precio,
          },
        }),
      ),
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

  // create para un solo detalle
  async create(dto: CreateMultipleDetallecotizacionDto) {
    if (!dto.detalles || dto.detalles.length !== 1) {
      throw new Error('Debe enviar exactamente un detalle');
    }

    const detalle = dto.detalles[0];

    const created = await this.prisma.detalleCotizacion.create({
      data: {
        idCotizacion: detalle.idCotizacion,
        idTipo_producto: detalle.idTipo_producto,
        ancho: detalle.ancho,
        alto: detalle.alto,
        precio: detalle.precio,
      },
    });

    await this.actualizarValorTotalCotizacion(detalle.idCotizacion);

    return {
      message: 'Detalle creado correctamente',
      data: created,
    };
  }

  // nuevo método en el mismo service
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
