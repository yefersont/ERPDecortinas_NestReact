import { IsInt, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCotizacioneDto {
  @IsInt()
  idCliente: number;

  @IsInt()
  idTipo_producto: number;

  @IsNumber()
  ancho: number;

  @IsNumber()
  alto: number;

  @IsString()
  @IsOptional()
  mando?: string;

  @IsNumber()
  valor_total: number;

  @IsDateString()
  fecha: string; // o Date si quieres manejarlo como objeto Date
}
