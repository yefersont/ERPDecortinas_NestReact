import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsInt()
  cedula: number;

  @IsString()
  nombre: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
