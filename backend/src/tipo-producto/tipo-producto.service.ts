import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { CreateTipoProductoCompletoDto } from './dto/create-tipo-producto-completo.dto';

@Injectable()
export class TipoProductoService {
  constructor(private prisma: PrismaService) { }

  // Obtener todos los tipos de producto
  async findAll() {
    return this.prisma.tipo_producto.findMany({
      include: {
        costos: {
          where: {
            fecha_fin: null,
          },
          orderBy: {
            fecha_inicio: 'desc',
          },
        },
      },
      orderBy: {
        nombre_tp: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.tipo_producto.findUnique({
      where: {
        idTipo_producto: id,
      },
      include: {
        costos: {
          where: {
            fecha_fin: null,
          },
        },
      },
    });

    if (!producto) {
      throw new NotFoundException(
        'Tipo de producto no encontrado',
      );
    }

    return producto;
  }

  async create(data: CreateTipoProductoDto) {
    const existe = await this.prisma.tipo_producto.findFirst({
      where: {
        nombre_tp: data.nombre_tp.trim(),
      },
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe un tipo de producto con ese nombre',
      );
    }

    return this.prisma.tipo_producto.create({
      data: {
        nombre_tp: data.nombre_tp.trim(),
      },
    });
  }

  async createCompleto(dto: CreateTipoProductoCompletoDto) {

    return await this.prisma.$transaction(async (tx) => {

      const producto = await tx.tipo_producto.create({
        data: {
          nombre_tp: dto.nombre_tp,
        },
      });

      const costo = await tx.costoTipoProducto.create({
        data: {
          idTipo_producto: producto.idTipo_producto,
          costo_base: dto.costo_base,
        },
      });

      return {
        producto,
        costo,
      };
    });
  }

  async update(
    id: number,
    data: UpdateTipoProductoDto,
  ) {
    const producto = await this.prisma.tipo_producto.findUnique({
      where: {
        idTipo_producto: id,
      },
    });

    if (!producto) {
      throw new NotFoundException(
        'Tipo de producto no encontrado',
      );
    }

    if (data.nombre_tp) {
      const duplicado =
        await this.prisma.tipo_producto.findFirst({
          where: {
            nombre_tp: data.nombre_tp.trim(),
            NOT: {
              idTipo_producto: id,
            },
          },
        });

      if (duplicado) {
        throw new BadRequestException(
          'Ya existe un tipo de producto con ese nombre',
        );
      }
    }

    return this.prisma.tipo_producto.update({
      where: {
        idTipo_producto: id,
      },
      data: {
        ...data,
        nombre_tp: data.nombre_tp?.trim(),
      },
    });
  }

}