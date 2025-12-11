import { Injectable } from '@nestjs/common';
import { PrismaClient, Clientes } from '@prisma/client';
import { CreateClienteDto } from './dto/create-clientes.dto';
import { UpdateClienteDto } from './dto/update-clientes.dto';

const prisma = new PrismaClient();

@Injectable()
export class ClientesService {

  findAll() {
    return prisma.clientes.findMany();
  }

  async findOne(id: number): Promise<Clientes | null> {
    return prisma.clientes.findUnique({
      where: { idCliente: id },
    });
  }

  create(data: CreateClienteDto) {
    return prisma.clientes.create({
      data,
    });
  }

  update(id: number, data: UpdateClienteDto) {
    return prisma.clientes.update({
      where: { idCliente: id },
      data,
    });
  }

  remove(id: number) {
    return prisma.clientes.delete({
      where: { idCliente: id },
    });
  }
}
