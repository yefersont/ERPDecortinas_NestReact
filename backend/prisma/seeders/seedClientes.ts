import { PrismaClient, Prisma } from "@prisma/client";
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Configuración de encriptación (debe coincidir con CryptoService)
const ALGORITHM = 'aes-256-gcm';

interface EncryptedData {
  iv: string;
  content: string;
  tag: string;
}

function encrypt(text: string): EncryptedData {
  if (!process.env.DATA_ENCRYPTION_KEY) {
    throw new Error('DATA_ENCRYPTION_KEY no está definida en las variables de entorno');
  }

  const key = Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    content: encrypted,
    tag: tag.toString('hex'),
  };
}

function toJsonValue(data: EncryptedData | typeof Prisma.DbNull): Prisma.InputJsonValue {
  return data as unknown as Prisma.InputJsonValue;
}

export async function seedClientes() {
  console.log('🌱 Iniciando seed de clientes...');

  try {
    // Validar que exista la clave de encriptación
    if (!process.env.DATA_ENCRYPTION_KEY) {
      throw new Error('❌ DATA_ENCRYPTION_KEY no está definida. Configúrala en tu archivo .env');
    }

    // Limpia la tabla
    await prisma.clientes.deleteMany();
    console.log('✅ Tabla clientes limpiada');

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

    for (const clienteData of clientes) {
      // Crear hash de la cédula para búsquedas
      const cedula_hash = crypto
        .createHash('sha256')
        .update(clienteData.cedula.toString())
        .digest('hex');

      // Encriptar datos sensibles
      const cedula_enc = encrypt(clienteData.cedula.toString());
      const telefono_enc = clienteData.telefono 
        ? encrypt(clienteData.telefono)
        : Prisma.DbNull;
      const direccion_enc = clienteData.direccion
        ? encrypt(clienteData.direccion)
        : Prisma.DbNull;

      // Crear cliente en la base de datos
      await prisma.clientes.create({
        data: {
          cedula_hash,
          cedula_enc: toJsonValue(cedula_enc),
          nombre: clienteData.nombre,
          apellidos: clienteData.apellidos,
          telefono_enc: toJsonValue(telefono_enc),
          direccion_enc: toJsonValue(direccion_enc),
        },
      });

      console.log(`Cliente ${clienteData.nombre} ${clienteData.apellidos} creado`);
    }

    console.log("Clientes seeded correctamente");
  } catch (error) {
    console.error('Error en seed de clientes:', error);
    throw error;
  }
}