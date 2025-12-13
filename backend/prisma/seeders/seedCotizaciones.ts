import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Insertando cotizaciones...");

  await prisma.cotizaciones.createMany({
    
    data: [
      {
        idCliente: 1,
        valor_total: 250000,
        fecha: new Date("2025-01-10"),
      },
      {
        idCliente: 2,
        valor_total: 180000,
        fecha: new Date("2025-02-15"),
      },
      {
        idCliente: 3,
        valor_total: 420000,
        fecha: new Date("2025-03-04"),
      },
      {
        idCliente: 1,
        valor_total: 350000,
        fecha: new Date("2025-03-25"),
      }
    ],
  });

  console.log("Cotizaciones insertadas correctamente.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
