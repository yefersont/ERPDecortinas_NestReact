import { PrismaClient, Rol } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedUsers() {
  // ⚠️ Solo usar deleteMany en desarrollo
  await prisma.user.deleteMany();

  const users = [
    {
      name: "Yeferson",
      email: "yeferson@gmail.com",
      password: await bcrypt.hash("123456", 10),
      rol: Rol.ADMIN, // 👈 admin
    },
    {
      name: "Brayan",
      email: "brayan@gmail.com",
      password: await bcrypt.hash("123456", 10),
      rol: Rol.USER, // 👈 usuario normal
    },
  ];

  await prisma.user.createMany({
    data: users,
  });

  console.log("Users seeded con roles y contraseñas hasheadas");
}

if (require.main === module) {
  seedUsers()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}