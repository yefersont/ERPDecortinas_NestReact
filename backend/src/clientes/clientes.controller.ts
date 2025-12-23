import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-clientes.dto';
import { UpdateClienteDto } from './dto/update-clientes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  
  @Get()
  // @Roles('ADMIN', 'USER')
  async findAll() {
    const clientes = await this.clientesService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Clientes obtenidos exitosamente',
      data: clientes,
    };
  }

  @Get(':id')
  // @Roles('ADMIN', 'USER')
  async getCliente(@Param('id') id: number) {
    const cliente = await this.clientesService.findOne(Number(id));
    if (!cliente) {
      throw new NotFoundException(`Cliente no encontrado ${id}`);
    }
    return cliente;
  }

  @Post()
  // @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateClienteDto) {
    const cliente = await this.clientesService.create(data);
    return {
      status: HttpStatus.CREATED,
      message: 'Cliente creado exitosamente',
      data: cliente,
    };
  }

  @Patch(':id')
  // @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateClienteDto,
  ) {
    const cliente = await this.clientesService.update(+id, data);
    return {
      status: HttpStatus.OK,
      message: 'Cliente actualizado exitosamente',
      data: cliente,
    };
  }

  @Delete(':id')
  // @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const cliente = await this.clientesService.remove(+id);
    return {
      status: HttpStatus.OK,
      message: 'Cliente eliminado exitosamente',
      data: cliente,
    };
  }
}
