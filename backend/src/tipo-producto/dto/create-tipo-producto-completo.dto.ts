import { IsNumber, IsString } from 'class-validator';

export class CreateTipoProductoCompletoDto {
    @IsString()
    nombre_tp: string;

    @IsNumber()
    costo_base: number;
}