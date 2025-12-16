import { Injectable } from '@nestjs/common';
import { CreateEstadisticaDto } from './dto/create-estadistica.dto';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstadisticasService {
  constructor(private prisma: PrismaService) {}

  // create(createEstadisticaDto: CreateEstadisticaDto) {
  //   return 'This action adds a new estadistica';
  // }

  // findAll() {
  //   return `This action returns all estadisticas`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} estadistica`;
  // }

  // update(id: number, updateEstadisticaDto: UpdateEstadisticaDto) {
  //   return `This action updates a #${id} estadistica`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} estadistica`;
  // }



async resumen() {

  const totalCotizaciones = await this.prisma.cotizaciones.count();

  const totalVentas = await this.prisma.ventas.count();

  const ingresosTotales = await this.prisma.ventas.aggregate({
    _sum: {
      total: true,
    },
  });

  const deudaTotal = await this.prisma.deudores.aggregate({
    _sum: {
      abono: true,
    },
  });

  const cotizacionesConVenta = await this.prisma.ventas.findMany({
    select: {  
      idCotizacion: true,
    }
  });

  const idVentas = cotizacionesConVenta.map(v => v.idCotizacion);

  const cotizacionesPendientes = await this.prisma.cotizaciones.count({
    where: {
      idCotizacion: {
        notIn: idVentas,
      },
    },
  });

  return {
    totalCotizaciones,
    totalVentas,
    ingresosTotales: ingresosTotales._sum.total ?? 0,
    deudaTotal: deudaTotal._sum.abono ?? 0,
    cotizacionesPendientes
  };

}

}
