import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Insertando ventas...");

  await prisma.ventas.createMany({
    data: [
      {
        fecha_venta: new Date("2025-01-15T10:30:00"),
        idCotizacion: 5,
      },
      {
        fecha_venta: new Date("2025-02-02T14:00:00"),
        idCotizacion: 6,
      },
      {
        fecha_venta: new Date("2025-03-10T09:15:00"),
        idCotizacion: 7,
      },
    ],
  });

  console.log("Ventas insertadas correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
