import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';

@Module({
  imports: [UsersModule, AuthModule, ClientesModule, CotizacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
