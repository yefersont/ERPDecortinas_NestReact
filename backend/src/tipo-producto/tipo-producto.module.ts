import { Module } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { TipoProductoController } from './tipo-producto.controller';

@Module({
  controllers: [TipoProductoController],
  providers: [TipoProductoService],
})
export class TipoProductoModule {}
