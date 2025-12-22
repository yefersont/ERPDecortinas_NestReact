import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

@Controller('tipo-producto')
export class TipoProductoController {
  constructor(private readonly tipoProductoService: TipoProductoService) {}

  @Post()
  async create(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    const data = await this.tipoProductoService.create(createTipoProductoDto);
    return {
      message: 'Tipo de producto creado correctamente',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.tipoProductoService.findAll();
    return {
      message: 'Tipos de producto obtenidos correctamente',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.tipoProductoService.findOne(+id);
    return {
      message: 'Tipo de producto obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTipoProductoDto: UpdateTipoProductoDto,
  ) {
    const data = await this.tipoProductoService.update(+id, updateTipoProductoDto);
    return {
      message: 'Tipo de producto actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.tipoProductoService.remove(+id);
    return {
      message: 'Tipo de producto eliminado correctamente',
      data,
    };
  }
}
