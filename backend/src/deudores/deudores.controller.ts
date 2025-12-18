import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DeudoresService } from './deudores.service';
import { CreateDeudoreDto } from './dto/create-deudore.dto';
import { UpdateDeudoreDto } from './dto/update-deudore.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('deudores')
export class DeudoresController {
  constructor(private readonly deudoresService: DeudoresService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateDeudoreDto) {
    return this.deudoresService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  findAll() {
    return this.deudoresService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deudoresService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeudoreDto,
  ) {
    return this.deudoresService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deudoresService.remove(id);
  }
}
