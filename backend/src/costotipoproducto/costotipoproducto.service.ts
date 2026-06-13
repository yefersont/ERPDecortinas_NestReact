import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCostotipoproductoDto } from './dto/create-costotipoproducto.dto';
import { UpdateCostotipoproductoDto } from './dto/update-costotipoproducto.dto';

@Injectable()
export class CostotipoproductoService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(
    createCostotipoproductoDto: CreateCostotipoproductoDto,
  ) {

    const producto = await this.prisma.tipo_producto.findUnique({
      where: {
        idTipo_producto:
          createCostotipoproductoDto.idTipo_producto,
      },
    });

    if (!producto) {
      throw new NotFoundException(
        'Tipo de producto no encontrado',
      );
    }

    const costoActual =
      await this.prisma.costoTipoProducto.findFirst({
        where: {
          idTipo_producto:
            createCostotipoproductoDto.idTipo_producto,
          fecha_fin: null,
        },
      });

    if (costoActual) {
      await this.prisma.costoTipoProducto.update({
        where: {
          idCosto: costoActual.idCosto,
        },
        data: {
          fecha_fin: new Date(),
        },
      });
    }

    return await this.prisma.costoTipoProducto.create({
      data: {
        idTipo_producto:
          createCostotipoproductoDto.idTipo_producto,
        costo_base:
          createCostotipoproductoDto.costo_base,
        fecha_inicio: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prisma.costoTipoProducto.findMany({
      where: {
        fecha_fin: null,
      },
      include: {
        tipoProducto: true,
      },
      orderBy: {
        idTipo_producto: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.costoTipoProducto.findUnique({
      where: {
        idCosto: id,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.costoTipoProducto.delete({
      where: {
        idCosto: id,
      }
    })
  }

}