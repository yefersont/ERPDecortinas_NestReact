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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tipo-producto')
export class TipoProductoController {
  constructor(private readonly tipoProductoService: TipoProductoService) { }

  @Post()
  @Roles('ADMIN')
  async create(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    const data = await this.tipoProductoService.create(createTipoProductoDto);

    return {
      message: 'Tipo de producto creado correctamente',
      data,
    };
  }

  @Get()
  @Roles('ADMIN', 'USER')
  async findAll() {
    const data = await this.tipoProductoService.findAll();

    return {
      message: 'Tipos de producto obtenidos correctamente',
      data,
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  async findOne(@Param('id') id: string) {
    const data = await this.tipoProductoService.findOne(+id);

    return {
      message: 'Tipo de producto obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateTipoProductoDto: UpdateTipoProductoDto,
  ) {
    const data = await this.tipoProductoService.update(
      +id,
      updateTipoProductoDto,
    );

    return {
      message: 'Tipo de producto actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const data = await this.tipoProductoService.remove(+id);

    return {
      message: 'Tipo de producto eliminado correctamente',
      data,
    };
  }
}