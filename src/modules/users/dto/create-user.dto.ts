import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Length,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    name: 'username',
    description:
      'Nombre de usuario único utilizado para iniciar sesión en el sistema',
    example: 'jdoe',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 50)
  username!: string;

  @ApiProperty({
    name: 'password',
    description:
      'Contraseña en texto plano; el sistema la almacenará de forma cifrada',
    example: 'P@ssw0rd2025',
    default: '',
    type: String,
  })
  @IsString()
  @Length(8, 200)
  password!: string;

  @ApiProperty({
    name: 'email',
    description:
      'Correo electrónico institucional del usuario, único en el sistema',
    example: 'jdoe@mp.gob.gt',
    default: '',
    type: String,
  })
  @IsString()
  @IsEmail()
  @Length(1, 200)
  email!: string;

  @ApiProperty({
    name: 'fullName',
    description:
      'Nombre completo del usuario tal como aparece en los registros oficiales',
    example: 'Juan Pérez López',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 200)
  fullName!: string;

  @ApiPropertyOptional({
    name: 'orgUnitId',
    description:
      'Identificador de la unidad organizacional a la que pertenece el usuario',
    example: 5,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  orgUnitId?: number;

  @ApiPropertyOptional({
    name: 'isActive',
    description:
      'Indica si la cuenta de usuario se encuentra activa para iniciar sesión',
    example: true,
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return true;
    if (value === true || value === 'true' || value === '1' || value === 1) {
      return true;
    }
    if (
      value === false ||
      value === 'false' ||
      value === '0' ||
      value === 0
    ) {
      return false;
    }
    return value;
  })
  isActive?: boolean = true;

  @ApiPropertyOptional({
    name: 'mustChangePassword',
    description:
      'Indica si el usuario debe cambiar su contraseña en el próximo inicio de sesión',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return false;
    if (value === true || value === 'true' || value === '1' || value === 1) {
      return true;
    }
    if (
      value === false ||
      value === 'false' ||
      value === '0' ||
      value === 0
    ) {
      return false;
    }
    return value;
  })
  mustChangePassword?: boolean = false;
}
