import { IsNotEmpty, IsInt, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateCotizacioneDto {
  @IsInt()
  idCliente: number;

  @IsInt()
  idTipo_producto: number;

  @IsNumber()
  @IsNotEmpty()
  ancho: number;

  @IsNumber()
  @IsNotEmpty()
  alto: number;

  @IsString()
  @IsNotEmpty()
  mando?: string;

  @IsNumber()
  @IsNotEmpty()
  valor_total: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string; // o Date si quieres manejarlo como objeto Date
}
