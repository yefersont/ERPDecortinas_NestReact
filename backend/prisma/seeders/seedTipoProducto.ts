import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedTipoProducto() {
  console.log("Insertando tipos de producto...");

  await prisma.tipo_producto.createMany({
    data: [
      { nombre_tp: "Enrollable" },
      { nombre_tp: "Sheer Screen" },
      { nombre_tp: "Panel Japones" },
      { nombre_tp: "Vertical 9cm" },
      { nombre_tp: "Vertical 13cm" },
      { nombre_tp: "Mini aluminio" },
      { nombre_tp: "Macro madera" },
      { nombre_tp: "Romana" },
      { nombre_tp: "Sheer Elegance" },
      { nombre_tp: "Macro aluminio" },
      { nombre_tp: "Enrollable premium" },
    ],
  });

  console.log("Tipos de producto insertados correctamente.");
}

