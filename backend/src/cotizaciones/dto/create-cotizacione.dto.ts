import {
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateCotizacioneDto {
  @IsInt()
  @IsNotEmpty()
  idCliente: number;

  @IsNumber()
  @IsNotEmpty()
  valor_total: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;
}
