import { Test, TestingModule } from '@nestjs/testing';
import { CostotipoproductoController } from './costotipoproducto.controller';
import { CostotipoproductoService } from './costotipoproducto.service';

describe('CostotipoproductoController', () => {
  let controller: CostotipoproductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostotipoproductoController],
      providers: [CostotipoproductoService],
    }).compile();

    controller = module.get<CostotipoproductoController>(CostotipoproductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
