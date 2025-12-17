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

  async ventasPorMes() {

    const year = new Date().getFullYear();

    const ventas = await this.prisma.ventas.groupBy({
    by: ['fecha_venta'],
    _sum: {
      total: true,
    },
    where: {
      fecha_venta: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
  });

    const resumen = Array(12).fill(0);

    ventas.forEach(v => {
      const mes = new Date(v.fecha_venta).getMonth(); // 0-11
      resumen[mes] += Number(v._sum.total);
    });

      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      return meses.map((mes, index) => ({
        mes,
        total: resumen[index],
      }));
    }

  async productosMasVendidos(limit = 5) {

  // 1️⃣ Obtener cotizaciones que sí se convirtieron en ventas
  const ventas = await this.prisma.ventas.findMany({
    select: {
      idCotizacion: true,
    },
  });

  const cotizacionesVendidas = ventas.map(v => v.idCotizacion);

  if (cotizacionesVendidas.length === 0) {
    return [];
  }

  const productos = await this.prisma.detalleCotizacion.groupBy({
    by: ['idTipo_producto'],
    _count: {
      idTipo_producto: true,
    },
    where: {
      idCotizacion: {
        in: cotizacionesVendidas,
      },
    },
    orderBy: {
      _count: {
        idTipo_producto: 'desc',
      },
    },
    take: limit,
  });

  const idsProductos = productos.map(p => p.idTipo_producto);

  const tiposProductos = await this.prisma.tipo_producto.findMany({
    where: {
      idTipo_producto: {
        in: idsProductos,
      },
    },
    select: {
      idTipo_producto: true,
      nombre_tp: true,
    },
  });

  // 4️⃣ Crear mapa id → nombre
  const mapaProductos = Object.fromEntries(
    tiposProductos.map(p => [p.idTipo_producto, p.nombre_tp])
  );

  // 5️⃣ Formatear respuesta final
  return productos.map(p => ({
    producto: mapaProductos[p.idTipo_producto] ?? 'Desconocido',
    vendidos: p._count.idTipo_producto,
  }));
}

  async clientesConMayorDeuda(limit = 5) {

    const ventasConDeuda = await this.prisma.ventas.findMany({
      where: {
        saldo_pendiente: {
          gt: 0,
        },
      },
      select: {
        saldo_pendiente: true,
        cotizacion: {
          select: {
            cliente: {
              select: {
                idCliente: true,
                nombre: true,
                apellidos: true,
              },
            },
          },
        },
      },
    });

    // Agrupar deuda por cliente
    const mapaDeudas = new Map<number, {
      cliente: string;
      deuda: number;
    }>();

    ventasConDeuda.forEach(v => {
      const cliente = v.cotizacion.cliente;
      const deuda = Number(v.saldo_pendiente);

      if (!mapaDeudas.has(cliente.idCliente)) {
        mapaDeudas.set(cliente.idCliente, {
          cliente: `${cliente.nombre} ${cliente.apellidos}`,
          deuda: 0,
        });
      }

      mapaDeudas.get(cliente.idCliente)!.deuda += deuda;
    });

    // Ordenar de mayor a menor deuda
    return Array.from(mapaDeudas.values())
      .sort((a, b) => b.deuda - a.deuda)
      .slice(0, limit);
  }


  async clientesConMasCompras(limit = 5) {

    const ventas = await this.prisma.ventas.findMany({
      select: {
        total: true,
        cotizacion: {
          select: {
            cliente: {
              select: {
                idCliente: true,
                nombre: true,
                apellidos: true,
              },
            },
          },
        },
      },
    });

    // Acumulador por cliente
    const acumulado = new Map<number, {
      cliente: string;
      compras: number;
      totalComprado: number;
    }>();

    ventas.forEach(v => {
      const cliente = v.cotizacion.cliente;
      const monto = Number(v.total);

      if (!acumulado.has(cliente.idCliente)) {
        acumulado.set(cliente.idCliente, {
          cliente: `${cliente.nombre} ${cliente.apellidos}`,
          compras: 0,
          totalComprado: 0,
        });
      }

      acumulado.get(cliente.idCliente)!.compras += 1;
      acumulado.get(cliente.idCliente)!.totalComprado += monto;
    });

    // Ordenar por dinero comprado (puedes cambiar a compras si quieres)
    return Array.from(acumulado.values())
      .sort((a, b) => b.totalComprado - a.totalComprado)
      .slice(0, limit);
  }


  async tiempoPromedioCierre() {

    const ventas = await this.prisma.ventas.findMany({
      select: {
        fecha_venta: true,
        cotizacion: {
          select: {
            fecha: true,
          },
        },
      },
    });

    if (ventas.length === 0) return 0;
    
  let totalDias = 0;
  let contador = 0;

  ventas.forEach(v => {
    const dias = (new Date(v.fecha_venta).getTime() -
                  new Date(v.cotizacion.fecha).getTime()) 
                  / (1000 * 60 * 60 * 24);

    if (dias >= 0 && dias <= 180) {
      totalDias += dias;
      contador++;
    }
  });

  return contador === 0 ? 0 : Math.round(totalDias / contador);
    
  }

}
