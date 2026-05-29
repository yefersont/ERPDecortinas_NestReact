import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CostotipoproductoService } from './costotipoproducto.service';
import { CreateCostotipoproductoDto } from './dto/create-costotipoproducto.dto';
import { UpdateCostotipoproductoDto } from './dto/update-costotipoproducto.dto';

@Controller('costotipoproducto')
export class CostotipoproductoController {
  constructor(
    private readonly costotipoproductoService: CostotipoproductoService,
  ) { }

  @Get()
  async findAll() {
    const costos = await this.costotipoproductoService.findAll();

    return {
      status: HttpStatus.OK,
      message: 'Costos obtenidos exitosamente',
      data: costos,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const costo = await this.costotipoproductoService.findOne(+id);

    return {
      status: HttpStatus.OK,
      message: 'Costo obtenido exitosamente',
      data: costo,
    };
  }

  @Post()
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCostotipoproductoDto: UpdateCostotipoproductoDto,
  ) {
    const costo = await this.costotipoproductoService.update(
      +id,
      updateCostotipoproductoDto,
    );

    return {
      status: 200,
      message: 'Costo actualizado exitosamente',
      data: costo,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const costo = await this.costotipoproductoService.remove(+id);

    return {
      status: HttpStatus.OK,
      message: 'Costo eliminado exitosamente',
      data: costo,
    };
  }
}