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

@Controller('cotizacion/detallecotizacion')
export class DetallecotizacionController {
  constructor(private readonly detalleService: DetallecotizacionService) {}

  // CREATE
  @Post()
  async create(@Body() dto: CreateDetallecotizacionDto) {
    const detalle = await this.detalleService.create(dto);

    return {
      status: HttpStatus.CREATED,
      message: 'Detalle de cotización creado exitosamente',
      data: detalle,
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
