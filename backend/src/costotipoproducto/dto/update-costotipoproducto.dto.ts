import { PartialType } from '@nestjs/mapped-types';
import { CreateCostotipoproductoDto } from './create-costotipoproducto.dto';

export class UpdateCostotipoproductoDto extends PartialType(CreateCostotipoproductoDto) {}
