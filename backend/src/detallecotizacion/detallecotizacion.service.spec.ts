import { Test, TestingModule } from '@nestjs/testing';
import { DetallecotizacionService } from './detallecotizacion.service';

describe('DetallecotizacionService', () => {
  let service: DetallecotizacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallecotizacionService],
    }).compile();

    service = module.get<DetallecotizacionService>(DetallecotizacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
