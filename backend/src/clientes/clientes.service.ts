import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClient, Clientes, Prisma } from '@prisma/client';
import { CreateClienteDto } from './dto/create-clientes.dto';
import { UpdateClienteDto } from './dto/update-clientes.dto';
import { CryptoService, EncryptedData } from 'src/common/crypto/crypto.service';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class ClientesService {
  constructor(private readonly cryptoService: CryptoService) {}

  // Helper para convertir EncryptedData a formato compatible con Prisma
  private toJsonValue(data: EncryptedData | typeof Prisma.DbNull): Prisma.InputJsonValue {
    return data as unknown as Prisma.InputJsonValue;
  }

  async findAll() {
    const clientes = await prisma.clientes.findMany({
      orderBy: {
        idCliente: 'desc',
      },
    });
    return clientes.map(cliente => this.decryptClienteData(cliente));
  }

  async findOne(id: number): Promise<any> {
    const cliente = await prisma.clientes.findUnique({
      where: { idCliente: id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return this.decryptClienteData(cliente);
  }

  async create(data: CreateClienteDto) {
    const cedula_hash = crypto
      .createHash('sha256')
      .update(data.cedula.toString())
      .digest('hex');

    const existingCliente = await prisma.clientes.findUnique({
      where: { cedula_hash },
    });

    if (existingCliente) {
      throw new ConflictException('Ya existe un cliente con esta cédula');
    }

    const cedula_enc = this.cryptoService.encrypt(data.cedula.toString());
    const telefono_enc = data.telefono 
      ? this.cryptoService.encrypt(data.telefono)
      : Prisma.DbNull;
    const direccion_enc = data.direccion
      ? this.cryptoService.encrypt(data.direccion)
      : Prisma.DbNull;

    const cliente = await prisma.clientes.create({
      data: {
        cedula_hash,
        cedula_enc: this.toJsonValue(cedula_enc),
        nombre: data.nombre,
        apellidos: data.apellidos,
        telefono_enc: this.toJsonValue(telefono_enc),
        direccion_enc: this.toJsonValue(direccion_enc),
      },
    });

    return this.decryptClienteData(cliente);
  }

  async update(id: number, data: UpdateClienteDto) {
    await this.findOne(id);

    const updateData: Prisma.ClientesUpdateInput = {};

    if (data.nombre) updateData.nombre = data.nombre;
    if (data.apellidos) updateData.apellidos = data.apellidos;

    if (data.cedula) {
      const cedula_hash = crypto
        .createHash('sha256')
        .update(data.cedula.toString())
        .digest('hex');

      const existingCliente = await prisma.clientes.findUnique({
        where: { cedula_hash },
      });

      if (existingCliente && existingCliente.idCliente !== id) {
        throw new ConflictException('Ya existe otro cliente con esta cédula');
      }

      updateData.cedula_hash = cedula_hash;
      updateData.cedula_enc = this.toJsonValue(
        this.cryptoService.encrypt(data.cedula.toString())
      );
    }

    if (data.telefono !== undefined) {
      updateData.telefono_enc = data.telefono
        ? this.toJsonValue(this.cryptoService.encrypt(data.telefono))
        : Prisma.DbNull;
    }

    if (data.direccion !== undefined) {
      updateData.direccion_enc = data.direccion
        ? this.toJsonValue(this.cryptoService.encrypt(data.direccion))
        : Prisma.DbNull;
    }

    const updatedCliente = await prisma.clientes.update({
      where: { idCliente: id },
      data: updateData,
    });

    return this.decryptClienteData(updatedCliente);
  } 

  async remove(id: number) {
    await this.findOne(id);

    await prisma.clientes.delete({
      where: { idCliente: id },
    });

    return { message: 'Cliente eliminado exitosamente' };
  }

  private decryptClienteData(cliente: Clientes): any {
    return {
      idCliente: cliente.idCliente,
      cedula: this.safeDecrypt(cliente.cedula_enc),
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      telefono: this.safeDecrypt(cliente.telefono_enc),
      direccion: this.safeDecrypt(cliente.direccion_enc),
    };
  }

  private safeDecrypt(data: any): string | null {
    if (!data || data === null) return null;
    
    if (this.cryptoService.isValidEncryptedData(data)) {
      try {
        return this.cryptoService.decrypt(data);
      } catch (error) {
        console.error('Error al desencriptar:', error);
        return null;
      }
    }
    
    return null;
  }

  async findByCedula(cedula: number): Promise<any> {
    const cedula_hash = crypto
      .createHash('sha256')
      .update(cedula.toString())
      .digest('hex');

    const cliente = await prisma.clientes.findUnique({
      where: { cedula_hash },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return this.decryptClienteData(cliente);
  }
}