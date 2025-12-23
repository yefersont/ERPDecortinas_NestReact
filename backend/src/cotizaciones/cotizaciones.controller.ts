import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { CreateCotizacionWithDetailsDto } from './dto/create-cotizacion-with-details.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  // Crear cotización con detalles (TRANSACCIONAL)
  @Post('with-details')
  // @Roles('ADMIN')
  async createWithDetails(@Body() createDto: CreateCotizacionWithDetailsDto) {
    const cotizacion = await this.cotizacionesService.createWithDetails(createDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Cotización con detalles creada exitosamente',
      data: cotizacion,
    };
  }

  @Post()
  // @Roles('ADMIN')
  async create(@Body() createCotizacioneDto: CreateCotizacioneDto) {
    const cotizacion = await this.cotizacionesService.create(createCotizacioneDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Cotización creada exitosamente',
      data: cotizacion,
    };
  }

  @Get()
  // @Roles('ADMIN', 'USER')
  async findAll() {
    const cotizaciones = await this.cotizacionesService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Cotizaciones obtenidas exitosamente',
      data: cotizaciones,
    };
  }

  @Get(':id')
  // @Roles('ADMIN', 'USER')
  async findOne(@Param('id') id: string) {
    const cotizacion = await this.cotizacionesService.findOne(+id);
    return {
      status: HttpStatus.OK,
      message: 'Cotización obtenida exitosamente',
      data: cotizacion,
    };
  }

  @Patch(':id')
  // @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateCotizacioneDto: UpdateCotizacioneDto
  ) {
    const cotizacion = await this.cotizacionesService.update(+id, updateCotizacioneDto);
    return {
      status: 200,
      message: 'Cotización actualizada exitosamente',
      data: cotizacion,
    };
  }

  @Delete(':id')
  // @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const cotizacion = await this.cotizacionesService.remove(+id);
    return {
      status: HttpStatus.OK,
      message: 'Cotización eliminada exitosamente',
      data: cotizacion,
    };
  }
}
