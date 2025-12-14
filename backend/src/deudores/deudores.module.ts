import { Module } from '@nestjs/common';
import { DeudoresService } from './deudores.service';
import { DeudoresController } from './deudores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeudoresController],
  providers: [DeudoresService],
})
export class DeudoresModule {}
