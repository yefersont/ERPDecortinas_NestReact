import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedCostoTipoProducto() {
  console.log("Insertando costos base...");

  const costosMap: Record<string, number> = {
    "Enrollable": 8000,
    "Sheer Screen": 12000,
    "Panel Japones": 15000,
    "Vertical 9cm": 9000,
    "Vertical 13cm": 9500,
    "Mini aluminio": 7000,
    "Macro madera": 16000,
    "Romana": 14000,
    "Sheer Elegance": 13000,
    "Macro aluminio": 15500,
    "Enrollable premium": 18000,
  };

  const tipos = await prisma.tipo_producto.findMany();

  for (const tipo of tipos) {
    await prisma.costoTipoProducto.create({
      data: {
        idTipo_producto: tipo.idTipo_producto,
        costo_base: costosMap[tipo.nombre_tp] || 10000
      }
    });
  }

  console.log("Costos base insertados correctamente.");
}