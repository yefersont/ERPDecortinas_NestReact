import { Controller, Get, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) { }

  @Get('resumen')
  @Roles('ADMIN', 'USER')
  async resumen() {
    return {
      message: 'Resumen de estadisticas',
      data: await this.estadisticasService.resumen()
    }
  }

  @Get('ventasPorMes')
  @Roles('ADMIN', 'USER')
  async ventasPorMes() {
    return {
      message: 'Ventas por mes',
      data: await this.estadisticasService.ventasPorMes()
    }
  }

  @Get('productosMasVendidos')
  @Roles('ADMIN', 'USER')
  async productosMasVendidos() {
    return {
      message: 'Productos mas vendidos',
      data: await this.estadisticasService.productosMasVendidos()
    }
  }

  @Get('clientesConMayorDeuda')
  @Roles('ADMIN', 'USER')
  async clientesConMayorDeuda() {
    return {
      message: 'Clientes con mayor deuda',
      data: await this.estadisticasService.clientesConMayorDeuda()
    }
  }

  @Get('clientesConMasCompras')
  @Roles('ADMIN', 'USER')
  async clientesConMasCompras() {
    return {
      message: 'Clientes con mas compras',
      data: await this.estadisticasService.clientesConMasCompras()
    }
  }

  @Get('tiempoPromedioCierre')
  @Roles('ADMIN', 'USER')
  async tiempoPromedioCierre() {
    return {
      message: 'Tiempo promedio',
      data: await this.estadisticasService.tiempoPromedioCierre()
    }
  }

}


