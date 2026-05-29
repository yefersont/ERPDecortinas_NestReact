import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCostotipoproductoDto } from './dto/create-costotipoproducto.dto';
import { UpdateCostotipoproductoDto } from './dto/update-costotipoproducto.dto';

@Injectable()
export class CostotipoproductoService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createCostotipoproductoDto: CreateCostotipoproductoDto) {
    return await this.prisma.costoTipoProducto.create({
      data: {
        idTipo_producto: createCostotipoproductoDto.idTipo_producto,
        costo_base: createCostotipoproductoDto.costo_base,
      },
    });

  }

  async update(
    id: number,
    updateCostotipoproductoDto: UpdateCostotipoproductoDto,
  ) {
    return await this.prisma.costoTipoProducto.update({
      where: {
        idCosto: id,
      },
      data: {
        ...updateCostotipoproductoDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.costoTipoProducto.findMany();
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