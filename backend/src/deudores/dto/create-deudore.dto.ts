import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeudoreDto {

  @IsNotEmpty()
  @IsNumber()
  idVenta: number;

  @IsNotEmpty()
  @IsNumber()
  abono: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fecha_abono: Date;
}
