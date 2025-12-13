import { IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateVentaDto {
  @IsNotEmpty()
  @IsDateString()
  fecha_venta: string; // formato ISO: '2025-12-12T00:00:00Z'

  @IsNotEmpty()
  @IsInt()
  idCotizacion: number;
}
