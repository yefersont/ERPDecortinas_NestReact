import { Module } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { TipoProductoController } from './tipo-producto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoProductoController],
  providers: [TipoProductoService],
})
export class TipoProductoModule { }
