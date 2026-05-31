import {
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateVentaDto {
  @IsNotEmpty()
  @IsDateString()
  fecha_venta: string;

  @IsNotEmpty()
  @IsInt()
  idCotizacion: number;

  @IsOptional()
  @IsNumber()
  abono_inicial?: number;
}