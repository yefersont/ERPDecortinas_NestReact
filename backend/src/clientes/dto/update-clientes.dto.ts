import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-clientes.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
