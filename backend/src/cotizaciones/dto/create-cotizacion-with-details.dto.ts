import {
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DetalleItemDto {
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

export class CreateCotizacionWithDetailsDto {
  @IsInt()
  @IsNotEmpty()
  idCliente: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetalleItemDto)
  detalles: DetalleItemDto[];
}
