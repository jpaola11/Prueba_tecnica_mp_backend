import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({
    name: 'code',
    description: 'Código único del rol dentro del sistema',
    example: 'ADMIN',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 50)
  code!: string;

  @ApiProperty({
    name: 'name',
    description: 'Nombre descriptivo del rol asignable a usuarios',
    example: 'Administrador del Sistema',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiPropertyOptional({
    name: 'description',
    description: 'Descripción del rol y sus funciones dentro del sistema',
    example:
      'Rol con acceso total para administración, gestión de usuarios y control de parámetros',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    name: 'isDefault',
    description:
      'Indica si el rol debe asignarse automáticamente a nuevos usuarios',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return false;
    if (value === true || value === 'true' || value === '1' || value === 1)
      return true;
    if (value === false || value === 'false' || value === '0' || value === 0)
      return false;
    return value;
  })
  isDefault?: boolean = false;
}
