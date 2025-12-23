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


// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cotizacion/detallecotizacion')
export class DetallecotizacionController {
  constructor(private readonly detalleService: DetallecotizacionService) {}

  // CREATE (un solo detalle)
  // @Post('single')
  //   async create(@Body() dto: CreateMultipleDetallecotizacionDto) {
  //     if (dto.detalles.length !== 1) {
  //       throw new Error('El endpoint single solo acepta un detalle');
  //     }

  //     const detalleCreado = await this.detalleService.create(dto);

  //     const cotizacionActualizada =
  //       await this.detalleService.actualizarValorTotalCotizacion(
  //         dto.detalles[0].idCotizacion,
  //       );

  //     return {
  //       status: HttpStatus.CREATED,
  //       message: 'Detalle de cotización creado exitosamente',
  //       data: {
  //         detalle: detalleCreado.data,
  //         valor_total: cotizacionActualizada.valor_total,
  //       },
  //     };
  //   }

  // CREATE (varios detalles)
  @Post()
    async createMultiple(@Body() dto: CreateMultipleDetallecotizacionDto) {
      const detallesCreados = await this.detalleService.createMultiple(dto);

      const cotizacionActualizada =
        await this.detalleService.actualizarValorTotalCotizacion(
          dto.detalles[0].idCotizacion,
        );

      return {
        status: HttpStatus.CREATED,
        message: 'Detalles de cotización creados exitosamente',
        data: {
          detalles: detallesCreados.data,
          valor_total: cotizacionActualizada.valor_total,
        },
      };
    }

  // FIND ALL
  @Get()
  // @Roles('ADMIN', 'USER')
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
  // @Roles('ADMIN', 'USER')
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
  // @Roles('ADMIN')
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
  // @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const detalle = await this.detalleService.remove(+id);

    return {
      status: HttpStatus.OK,
      message: 'Detalle eliminado correctamente',
      data: detalle,
    };
  }
}
