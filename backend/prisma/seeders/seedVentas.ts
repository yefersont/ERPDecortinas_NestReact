import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedVentas() {
  console.log('Insertando ventas...');

  const cotizaciones = await prisma.cotizaciones.findMany({
    orderBy: { idCotizacion: 'asc' },
  });

  if (cotizaciones.length === 0) {
    throw new Error('No hay cotizaciones para crear ventas');
  }

  await prisma.ventas.createMany({
    data: cotizaciones.slice(0, 3).map((cotizacion, index) => {
      const total = cotizacion.valor_total;
      const abonoInicial = total.div(2); // mitad
      const saldo = total.minus(abonoInicial);

      return {
        fecha_venta: new Date(
          index === 0
            ? '2025-01-15T10:30:00'
            : index === 1
            ? '2025-02-02T14:00:00'
            : '2025-03-10T09:15:00'
        ),
        idCotizacion: cotizacion.idCotizacion,
        total: total,
        saldo_pendiente: saldo,
        estado_pago: 'PENDIENTE',
      };
    }),
  });

  console.log('Ventas insertadas correctamente.');
}
