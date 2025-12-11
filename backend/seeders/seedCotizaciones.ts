import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Insertando cotizaciones...");

  await prisma.cotizaciones.createMany({
    data: [
      {
        idCliente: 1,
        idTipo_producto: 1, // Enrollable
        ancho: 1.20,
        alto: 1.80,
        mando: "Derecha",
        valor_total: 250000,
        fecha: new Date("2025-01-10"),
      },
      {
        idCliente: 2,
        idTipo_producto: 2, // Sheer Screen
        ancho: 1.00,
        alto: 1.50,
        mando: "Izquierda",
        valor_total: 180000,
        fecha: new Date("2025-02-15"),
      },
      {
        idCliente: 3,
        idTipo_producto: 3, // Panel Japones
        ancho: 2.00,
        alto: 2.20,
        mando: "Derecha",
        valor_total: 420000,
        fecha: new Date("2025-03-04"),
      },
      {
        idCliente: 1,
        idTipo_producto: 9, // Sheer Elegance
        ancho: 1.80,
        alto: 1.60,
        mando: null,
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
