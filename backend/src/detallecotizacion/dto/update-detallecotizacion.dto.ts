import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallecotizacionDto } from './create-detallecotizacion.dto';

export class UpdateDetallecotizacionDto extends PartialType(CreateDetallecotizacionDto) {}
