import { IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateDetallecotizacionDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  idCotizacion: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  idTipo_producto: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  ancho: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  alto: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  precio: number;
}
