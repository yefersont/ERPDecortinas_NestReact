import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTipoProductoCompletoDto } from './dto/create-tipo-producto-completo.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tipo-producto')
export class TipoProductoController {
  constructor(
    private readonly tipoProductoService: TipoProductoService,
  ) { }

  @Get('obtener')
  @Roles('ADMIN', 'USER')
  async obtener() {
    return {
      message: 'Tipos de producto obtenidos correctamente',
      data: await this.tipoProductoService.findAll(),
    };
  }

  @Get('obtener/:id')
  @Roles('ADMIN', 'USER')
  async obtenerPorId(@Param('id') id: string) {
    return {
      message: 'Tipo de producto obtenido correctamente',
      data: await this.tipoProductoService.findOne(+id),
    };
  }

  @Post('crear')
  @Roles('ADMIN')
  async crear(
    @Body() createTipoProductoDto: CreateTipoProductoDto,
  ) {
    return {
      message: 'Tipo de producto creado correctamente',
      data: await this.tipoProductoService.create(
        createTipoProductoDto,
      ),
    };
  }

  @Post('/crear-completo')
  @Roles('ADMIN')
  async createCompleto(
    @Body() dto: CreateTipoProductoCompletoDto,
  ) {

    const data =
      await this.tipoProductoService.createCompleto(dto);

    return {
      statusCode: 201,
      message: 'Producto y costo creados correctamente',
      data,
    };
  }

  @Patch('actualizar/:id')
  @Roles('ADMIN')
  async actualizar(
    @Param('id') id: string,
    @Body() updateTipoProductoDto: UpdateTipoProductoDto,
  ) {
    return {
      message: 'Tipo de producto actualizado correctamente',
      data: await this.tipoProductoService.update(
        +id,
        updateTipoProductoDto,
      ),
    };
  }

}