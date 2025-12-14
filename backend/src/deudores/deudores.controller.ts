import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DeudoresService } from './deudores.service';
import { CreateDeudoreDto } from './dto/create-deudore.dto';
import { UpdateDeudoreDto } from './dto/update-deudore.dto';

@Controller('deudores')
export class DeudoresController {
  constructor(private readonly deudoresService: DeudoresService) {}

  @Post()
  create(@Body() dto: CreateDeudoreDto) {
    return this.deudoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.deudoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deudoresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeudoreDto,
  ) {
    return this.deudoresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deudoresService.remove(id);
  }
}
