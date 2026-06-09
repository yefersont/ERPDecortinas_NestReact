import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificacionesService {
  constructor(private prisma: PrismaService) { }

  async obtenerNotificaciones() {
    const ventasPendientes = await this.prisma.ventas.findMany({
      where: {
        estado_pago: 'PENDIENTE',
      },
      include: {
        cotizacion: {
          include: {
            cliente: true,
          },
        },
      },
    });

    const hoy = new Date();

    const notificaciones = ventasPendientes
      .map((venta) => {
        const diasMora = Math.floor(
          (hoy.getTime() - new Date(venta.fecha_venta).getTime()) /
          (1000 * 60 * 60 * 24),
        );

        return {
          idVenta: venta.idVenta,
          cliente: `${venta.cotizacion.cliente.nombre} ${venta.cotizacion.cliente.apellidos}`,
          saldoPendiente: Number(venta.saldo_pendiente),
          diasMora,
        };
      })
      .filter((n) => n.diasMora >= 30);

    return {
      cantidad: notificaciones.length,
      notificaciones,
    };
  }
}