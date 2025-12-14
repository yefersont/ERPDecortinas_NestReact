import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDeudores() {
  console.log('Creando Deudores...');

  // Obtener ventas existentes
  const ventas = await prisma.ventas.findMany();

  if (ventas.length === 0) {
    console.warn('No hay ventas, no se pueden crear deudores');
    return;
  }

  const deudoresData = ventas.map((venta, index) => ({
    idVenta: venta.idVenta,
    abono: index % 2 === 0 ? 50000 : 30000,
    fecha_abono: new Date(),
  }));

  await prisma.deudores.createMany({
    data: deudoresData,
  });

  console.log(`${deudoresData.length} deudores creados`);
}
