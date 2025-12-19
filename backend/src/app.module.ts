import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { DetallecotizacionModule } from './detallecotizacion/detallecotizacion.module';
import { PrismaModule } from './prisma/prisma.module';
import { VentasModule } from './ventas/ventas.module';
import { DeudoresModule } from './deudores/deudores.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ClientesModule,
    CotizacionesModule,
    DetallecotizacionModule,
    PrismaModule,
    VentasModule,
    DeudoresModule,
    EstadisticasModule,
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl: 60,
          limit: 10,
        },
      ]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
