import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fixUserPassword() {
  const email = 'yeferson@gmail.com';
  const plainPassword = '123456';

  // Buscar el usuario
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ Usuario no encontrado');
    return;
  }

  console.log('✅ Usuario encontrado:', user.email);
  console.log('Password actual en DB:', user.password);

  // Verificar si la contraseña actual funciona
  const isValid = await bcrypt.compare(plainPassword, user.password);
  console.log('¿La contraseña actual es válida?', isValid);

  if (!isValid) {
    console.log('\n🔧 Actualizando contraseña...');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('✅ Contraseña actualizada correctamente');
    console.log('Nueva contraseña hasheada:', hashedPassword);

    // Verificar nuevamente
    const newUser = await prisma.user.findUnique({
      where: { email },
    });
    const newIsValid = await bcrypt.compare(plainPassword, newUser!.password);
    console.log('¿La nueva contraseña es válida?', newIsValid);
  } else {
    console.log('✅ La contraseña ya es válida, no se necesita actualizar');
  }
}

fixUserPassword()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
