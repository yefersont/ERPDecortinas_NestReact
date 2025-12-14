import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { DetallecotizacionService } from './detallecotizacion.service';
import { CreateDetallecotizacionDto } from './dto/create-detallecotizacion.dto';
import { UpdateDetallecotizacionDto } from './dto/update-detallecotizacion.dto';
import { CreateMultipleDetallecotizacionDto } from './dto/create-multiple-detallecotizacion.dto';


@Controller('cotizacion/detallecotizacion')
export class DetallecotizacionController {
  constructor(private readonly detalleService: DetallecotizacionService) {}

  // CREATE (un solo detalle)
  @Post('single')
  async create(@Body() dto: CreateDetallecotizacionDto) {
    const detalle = await this.detalleService.create(dto);

    // opcional: traer la cotización actualizada
    const cotizacionActualizada = await this.detalleService.actualizarValorTotalCotizacion(detalle.data.idCotizacion);

    return {
      status: HttpStatus.CREATED,
      message: 'Detalle de cotización creado exitosamente',
      data: {
        detalle: detalle.data,
        valor_total: cotizacionActualizada.valor_total,
      },
    };
  }

  // CREATE (varios detalles)
  @Post('multiple')
  async createMultiple(@Body() dto: CreateMultipleDetallecotizacionDto) {
    const detalles = await this.detalleService.createMultiple(dto);

    // traer valor total actualizado de la cotización
    const idCotizacion = dto.detalles[0].idCotizacion;
    const cotizacionActualizada = await this.detalleService.actualizarValorTotalCotizacion(idCotizacion);

    return {
      status: HttpStatus.CREATED,
      message: 'Detalles de cotización creados exitosamente',
      data: {
        detalles: detalles.data,
        valor_total: cotizacionActualizada.valor_total,
      },
    };
  }

  // FIND ALL
  @Get()
  async findAll() {
    const detalles = await this.detalleService.findAll();

    return {
      status: HttpStatus.OK,
      message: 'Lista de detalles obtenida correctamente',
      data: detalles,
    };
  }

  // FIND ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const detalle = await this.detalleService.findOne(+id);

    return {
      status: HttpStatus.OK,
      message: 'Detalle obtenido exitosamente',
      data: detalle,
    };
  }

  // UPDATE
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDetallecotizacionDto,
  ) {
    const detalle = await this.detalleService.update(+id, dto);

    return {
      status: HttpStatus.OK,
      message: 'Detalle actualizado correctamente',
      data: detalle,
    };
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const detalle = await this.detalleService.remove(+id);

    return {
      status: HttpStatus.OK,
      message: 'Detalle eliminado correctamente',
      data: detalle,
    };
  }
}
