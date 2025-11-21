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

export class ChangePasswordDto {
  @ApiProperty({
    name: 'currentPassword',
    description:
      'Contraseña actual del usuario, utilizada para validar el cambio de contraseña',
    example: 'MiContraseñaActual123',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 200)
  currentPassword!: string;

  @ApiProperty({
    name: 'newPassword',
    description: 'Nueva contraseña que se desea establecer para el usuario',
    example: 'MiNuevaContraseñaSegura456',
    default: '',
    type: String,
  })
  @IsString()
  @Length(8, 200)
  newPassword!: string;

  @ApiProperty({
    name: 'confirmNewPassword',
    description:
      'Confirmación de la nueva contraseña, debe coincidir exactamente con newPassword',
    example: 'MiNuevaContraseñaSegura456',
    default: '',
    type: String,
  })
  @IsString()
  @Length(8, 200)
  confirmNewPassword!: string;
}
