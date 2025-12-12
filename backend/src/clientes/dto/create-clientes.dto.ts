import {IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsInt()
  cedula: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  telefono?: string;

  @IsString()
  @IsNotEmpty()
  direccion?: string;
}
