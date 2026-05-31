import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDetallesCotizacion() {
  console.log("Insertando detalles de cotizaciones...");

  const detalles = [
    {
      idCotizacion: 1,
      idTipo_producto: 1,
      ancho: 1.20,
      alto: 1.80,
      precio: 250000,
    },
    {
      idCotizacion: 2,
      idTipo_producto: 2,
      ancho: 1.00,
      alto: 1.50,
      precio: 180000,
    },
    {
      idCotizacion: 3,
      idTipo_producto: 3,
      ancho: 2.00,
      alto: 2.20,
      precio: 420000,
    },
    {
      idCotizacion: 4,
      idTipo_producto: 9,
      ancho: 1.80,
      alto: 1.60,
      precio: 350000,
    }
  ];

  for (const d of detalles) {

    // 🔹 1. Buscar costo vigente
    const costo = await prisma.costoTipoProducto.findFirst({
      where: {
        idTipo_producto: d.idTipo_producto,
        fecha_fin: null
      }
    });

    if (!costo) {
      throw new Error(`No existe costo para tipo_producto ${d.idTipo_producto}`);
    }

    // 🔹 2. Calcular área
    const area = Number(d.ancho) * Number(d.alto);

    // 🔹 3. Calcular costo
    const costoCalculado = costo.costo_base.toNumber() * area;

    // 🔹 4. Insertar
    await prisma.detalleCotizacion.create({
      data: {
        ...d,
        costo_calculado: costoCalculado
      }
    });
  }

  console.log("Detalles de cotizaciones insertados correctamente.");
}