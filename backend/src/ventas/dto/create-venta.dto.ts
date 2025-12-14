import { IsNotEmpty, IsInt, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateVentaDto {
  @IsNotEmpty()
  @IsDateString()
  fecha_venta: string;

  @IsNotEmpty()
  @IsInt()
  idCotizacion: number;

  // opcional: si no lo mandan, se toma el 50 %
  @IsOptional()
  @IsNumber()
  abono_inicial?: number;
}
