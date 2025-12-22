import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre_tp: string;
}
