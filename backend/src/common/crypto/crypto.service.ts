import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// Tipo exportado para usar en otros servicios
export interface EncryptedData {
  iv: string;
  content: string;
  tag: string;
}

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    if (!process.env.DATA_ENCRYPTION_KEY) {
      throw new Error('DATA_ENCRYPTION_KEY no está definida en las variables de entorno');
    }

    // Validar que la clave tenga 32 bytes (256 bits)
    const keyBuffer = Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex');
    if (keyBuffer.length !== 32) {
      throw new Error('DATA_ENCRYPTION_KEY debe ser una clave hexadecimal de 64 caracteres (32 bytes)');
    }

    this.key = keyBuffer;
  }

  encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      iv: iv.toString('hex'),
      content: encrypted,
      tag: tag.toString('hex'),
    };
  }

  decrypt(payload: EncryptedData): string {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(payload.iv, 'hex'),
      );

      decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));

      let decrypted = decipher.update(payload.content, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('Error al desencriptar los datos: datos corruptos o clave incorrecta');
    }
  }

  // Método auxiliar para validar si un objeto es EncryptedData válido
  isValidEncryptedData(data: any): data is EncryptedData {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.iv === 'string' &&
      typeof data.content === 'string' &&
      typeof data.tag === 'string' &&
      data.iv.length === 32 && // 16 bytes en hex = 32 caracteres
      data.content.length > 0 &&
      data.tag.length === 32  // 16 bytes en hex = 32 caracteres
    );
  }
}