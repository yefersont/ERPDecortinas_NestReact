import { Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { CryptoService } from 'src/common/crypto/crypto.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, CryptoService]
})
export class ClientesModule {}
