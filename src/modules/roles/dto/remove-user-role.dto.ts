import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class RemoveUserRoleDto {
  @ApiProperty({
    name: 'userId',
    description: 'Identificador del usuario al que se le removerá el rol',
    example: 15,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  userId!: number;

  @ApiProperty({
    name: 'roleId',
    description: 'Identificador del rol que será retirado del usuario',
    example: 3,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  roleId!: number;
}
