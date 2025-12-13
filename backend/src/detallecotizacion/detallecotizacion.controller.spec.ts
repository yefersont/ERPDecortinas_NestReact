import { Test, TestingModule } from '@nestjs/testing';
import { DetallecotizacionController } from './detallecotizacion.controller';
import { DetallecotizacionService } from './detallecotizacion.service';

describe('DetallecotizacionController', () => {
  let controller: DetallecotizacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallecotizacionController],
      providers: [DetallecotizacionService],
    }).compile();

    controller = module.get<DetallecotizacionController>(DetallecotizacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
