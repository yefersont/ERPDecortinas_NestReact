import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CostotipoproductoService } from './costotipoproducto.service';
import { CreateCostotipoproductoDto } from './dto/create-costotipoproducto.dto';
import { UpdateCostotipoproductoDto } from './dto/update-costotipoproducto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('costotipoproducto')
export class CostotipoproductoController {
  constructor(
    private readonly costotipoproductoService: CostotipoproductoService,
  ) { }

  @Get()
  @Roles('ADMIN', 'USER')
  async findAll() {
    const costos = await this.costotipoproductoService.findAll();

    return {
      status: HttpStatus.OK,
      message: 'Costos obtenidos exitosamente',
      data: costos,
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  async findOne(@Param('id') id: string) {
    const costo = await this.costotipoproductoService.findOne(+id);

    return {
      status: HttpStatus.OK,
      message: 'Costo obtenido exitosamente',
      data: costo,
    };
  }

  @Post()
  // @Roles('ADMIN')
  async create(
    @Body() createCostotipoproductoDto: CreateCostotipoproductoDto,
  ) {
    const costo = await this.costotipoproductoService.create(
      createCostotipoproductoDto,
    );

    return {
      status: HttpStatus.CREATED,
      message: 'Costo creado exitosamente',
      data: costo,
    };
  }



  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    const costo = await this.costotipoproductoService.remove(+id);

    return {
      status: HttpStatus.OK,
      message: 'Costo eliminado exitosamente',
      data: costo,
    };
  }
}