import { Module } from '@nestjs/common';
import { DetallecotizacionService } from './detallecotizacion.service';
import { DetallecotizacionController } from './detallecotizacion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [DetallecotizacionController],
  providers: [DetallecotizacionService],
})
export class DetallecotizacionModule {}
