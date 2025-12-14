import { PartialType } from '@nestjs/mapped-types';
import { CreateDeudoreDto } from './create-deudore.dto';

export class UpdateDeudoreDto extends PartialType(CreateDeudoreDto) {}
