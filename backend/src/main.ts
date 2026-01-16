import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],

  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades extra que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si llegan propiedades extra
    transform: true, // Convierte tipos automáticamente (ej: string -> number)
  }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
