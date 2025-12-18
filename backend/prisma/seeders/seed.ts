import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seedUsers';
import { seedTipoProducto } from './seedTipoProducto';
import { seedClientes } from './seedClientes';
import { seedCotizaciones } from './seedCotizaciones';
import { seedDetallesCotizacion } from './seedDetallesCotizacion';
import { seedVentas } from './seedVentas';
import { seedDeudores } from './seedDeudores';

const prisma = new PrismaClient();

async function main() { 
  await seedUsers();
  await seedTipoProducto();       // independiente
  await seedClientes();           // base
  await seedCotizaciones();       // depende de clientes
  await seedDetallesCotizacion(); // depende de cotizaciones + tipo producto
  await seedVentas();             // depende de cotizaciones
  await seedDeudores();           // depende de ventas
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
