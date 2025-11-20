import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  Min,
  Max,
  Length,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    name: 'usernameOrEmail',
    description:
      'Nombre de usuario o correo electrónico registrado en el sistema para autenticación',
    example: 'juan.perez',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 150)
  usernameOrEmail!: string;

  @ApiProperty({
    name: 'password',
    description: 'Contraseña en texto plano para autenticación',
    example: 'MiContraseñaSegura123',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 200)
  password!: string;
}
