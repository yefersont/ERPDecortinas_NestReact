import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    // Access Token: corta duración (15 minutos)
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // Refresh Token: larga duración (7 días), solo con el user ID
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return {
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        rol: user.rol,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verificar el refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      // Obtener el usuario actualizado
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      // Generar nuevo access token
      const newPayload = {
        sub: user.id,
        email: user.email,
        rol: user.rol,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          rol: user.rol,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout() {
    // En una implementación más robusta, aquí se agregaría el refresh token
    // a una lista negra en Redis o base de datos
    return {
      message: 'Logout exitoso',
    };
  }
}
