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
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';


// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  // @Roles('ADMIN')
  create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  @Get()
  // @Roles('ADMIN', 'USER')
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  // @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Patch(':id')
  // @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateVentaDto) {
    return this.ventasService.update(+id, dto);
  }

  @Delete(':id')
  // @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(+id);
  }
}
