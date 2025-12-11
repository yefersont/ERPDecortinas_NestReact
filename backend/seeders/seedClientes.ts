import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

  // Limpia la tabla
  await prisma.clientes.deleteMany();

  const clientes = [
    {
      cedula: 123456789,
      nombre: "Juan",
      apellidos: "Pérez",
      telefono: "3001234567",
      direccion: "Calle 10 # 5-20"
    },
    {
      cedula: 987654321,
      nombre: "María",
      apellidos: "Gómez",
      telefono: "3019876543",
      direccion: "Carrera 15 # 8-33"
    },
    {
      cedula: 555666777,
      nombre: "Carlos",
      apellidos: "Rodríguez",
      telefono: "3025566777",
      direccion: "Av. Principal 20-45"
    }
  ];

  for (const cliente of clientes) {
    await prisma.clientes.create({ data: cliente });
  }

  console.log("Clientes seeded correctamente");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
