import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  // @Post()
  // create(@Body() createEstadisticaDto: CreateEstadisticaDto) {
  //   return this.estadisticasService.create(createEstadisticaDto);
  // }

  // @Get()
  // findAll() {
  //   return this.estadisticasService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.estadisticasService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEstadisticaDto: UpdateEstadisticaDto) {
  //   return this.estadisticasService.update(+id, updateEstadisticaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.estadisticasService.remove(+id);
  // }

  @Get('resumen')
  async resumen() {
    return{ 
      message: 'Resumen de estadisticas',
      data: await this.estadisticasService.resumen()
    }
  }
}
