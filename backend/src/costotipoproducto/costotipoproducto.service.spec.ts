import { Test, TestingModule } from '@nestjs/testing';
import { CostotipoproductoService } from './costotipoproducto.service';

describe('CostotipoproductoService', () => {
  let service: CostotipoproductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostotipoproductoService],
    }).compile();

    service = module.get<CostotipoproductoService>(CostotipoproductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
