import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDetallesCotizacion() {
  console.log("Insertando detalles de cotizaciones...");

  await prisma.detalleCotizacion.createMany({
    data: [
      {
        idCotizacion: 1,
        idTipo_producto: 1, // Enrollable
        ancho: 1.20,
        alto: 1.80,
        precio: 250000,
      },
      {
        idCotizacion: 2,
        idTipo_producto: 2, // Sheer Screen
        ancho: 1.00,
        alto: 1.50,
        precio: 180000,
      },
      {
        idCotizacion: 3,
        idTipo_producto: 3, // Panel Japones
        ancho: 2.00,
        alto: 2.20,
        precio: 420000,
      },
      {
        idCotizacion: 4,
        idTipo_producto: 9, // Sheer Elegance
        ancho: 1.80,
        alto: 1.60,
        precio: 350000,
      }
    ],
  });

  console.log("Detalles de cotizaciones insertados correctamente.");
}
