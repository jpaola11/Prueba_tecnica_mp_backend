import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateUserPasswordDto {
  @ApiProperty({
    name: 'currentPassword',
    description:
      'Contraseña actual del usuario, utilizada para validar la solicitud de cambio de contraseña',
    example: 'P@ssw0rd2024',
    default: '',
    type: String,
  })
  @IsString()
  @Length(8, 200)
  currentPassword!: string;

  @ApiProperty({
    name: 'newPassword',
    description: 'Nueva contraseña que se asignará a la cuenta del usuario',
    example: 'Nuev@P4ssw0rd2025',
    default: '',
    type: String,
  })
  @IsString()
  @Length(8, 200)
  newPassword!: string;

  @ApiProperty({
    name: 'confirmPassword',
    description:
      'Confirmación de la nueva contraseña; debe coincidir con el valor del campo newPassword',
    example: 'Nuev@P4ssw0rd2025',
    default: '',
    type: String,
  })
  @IsString()
  @Length(8, 200)
  confirmPassword!: string;
}
