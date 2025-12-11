import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  async create(@Body() createCotizacioneDto: CreateCotizacioneDto) {
    const cotizacion = await this.cotizacionesService.create(createCotizacioneDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Cotización creada exitosamente',
      data: cotizacion,
    };
  }

  @Get()
  async findAll() {
    const cotizaciones = await this.cotizacionesService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Cotizaciones obtenidas exitosamente',
      data: cotizaciones,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cotizacion = await this.cotizacionesService.findOne(+id);
    return {
      status: HttpStatus.OK,
      message: 'Cotización obtenida exitosamente',
      data: cotizacion,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCotizacioneDto: UpdateCotizacioneDto) {
    const cotizacion = await this.cotizacionesService.update(+id, updateCotizacioneDto);
    return {
      status: HttpStatus.OK,
      message: 'Cotización actualizada exitosamente',
      data: cotizacion,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cotizacionesService.remove(+id);
    return {
      status: HttpStatus.OK,
      message: 'Cotización eliminada exitosamente',
    };
  }
}
