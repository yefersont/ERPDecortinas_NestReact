import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';

@Module({
  controllers: [ExportController],
  providers: [ExportService, PrismaService, CryptoService],
})
export class ExportModule {}
