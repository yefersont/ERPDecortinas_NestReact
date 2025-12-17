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
  @Get('ventasPorMes')
  async ventasPorMes() {
    return{
      message: 'Ventas por mes',
      data: await this.estadisticasService.ventasPorMes()
    }
  }

  @Get('productosMasVendidos')
  async productosMasVendidos() {
    return{
      message: 'Productos mas vendidos',
      data: await this.estadisticasService.productosMasVendidos()
    }
  }

  @Get('clientesConMayorDeuda')
  async clientesConMayorDeuda() {
    return{
      message: 'Clientes con mayor deuda',
      data: await this.estadisticasService.clientesConMayorDeuda()
    }
  }

  @Get('clientesConMasCompras')
  async clientesConMasCompras() {
    return{
      message: 'Clientes con mas compras',
      data: await this.estadisticasService.clientesConMasCompras()
    }
  }

  @Get('tiempoPromedioCierre')
  async tiempoPromedioCierre() {
    return{
      message: 'Tiempo promedio',
      data: await this.estadisticasService.tiempoPromedioCierre()
    }
  }
  
}


