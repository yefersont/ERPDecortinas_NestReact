import { IsNumber } from 'class-validator';

export class CreateCostotipoproductoDto {

    @IsNumber()
    idTipo_producto: number;

    @IsNumber()
    costo_base: number;
}