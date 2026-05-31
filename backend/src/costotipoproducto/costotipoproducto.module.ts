import { Module } from '@nestjs/common';
import { CostotipoproductoService } from './costotipoproducto.service';
import { CostotipoproductoController } from './costotipoproducto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CostotipoproductoController],
  providers: [CostotipoproductoService],
})
export class CostotipoproductoModule { }