import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DetallecotizacionService } from './detallecotizacion.service';
import { CreateDetallecotizacionDto } from './dto/create-detallecotizacion.dto';
import { UpdateDetallecotizacionDto } from './dto/update-detallecotizacion.dto';
import { CreateMultipleDetallecotizacionDto } from './dto/create-multiple-detallecotizacion.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cotizacion/detallecotizacion')
export class DetallecotizacionController {
  constructor(private readonly detalleService: DetallecotizacionService) { }

  @Post()
  @Roles('ADMIN', 'USER')
  async createMultiple(@Body() dto: CreateMultipleDetallecotizacionDto) {
    const detallesCreados = await this.detalleService.createMultiple(dto);

    return {
      status: HttpStatus.CREATED,
      message: 'Detalles de cotización creados exitosamente',
      data: detallesCreados.data,
    };
  }

  // FIND ALL
  @Get()
  @Roles('ADMIN', 'USER')
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
  @Roles('ADMIN', 'USER')
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
  @Roles('ADMIN')
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
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const detalle = await this.detalleService.remove(+id);

    return {
      status: HttpStatus.OK,
      message: 'Detalle eliminado correctamente',
      data: detalle,
    };
  }
}
