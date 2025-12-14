import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateDetallecotizacionDto } from './create-detallecotizacion.dto';

export class CreateMultipleDetallecotizacionDto {
  @ValidateNested({ each: true })
  @Type(() => CreateDetallecotizacionDto)
  detalles: CreateDetallecotizacionDto[];
}
