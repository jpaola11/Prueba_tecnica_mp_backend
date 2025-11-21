import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AssignUserRoleDto {
  @ApiProperty({
    name: 'userId',
    description: 'Identificador del usuario al que se le asignará el rol',
    example: 15,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  userId!: number;

  @ApiProperty({
    name: 'roleId',
    description: 'Identificador del rol que será asignado al usuario',
    example: 3,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  roleId!: number;

  @ApiPropertyOptional({
    name: 'isPrimary',
    description: 'Define si este rol será el rol principal del usuario',
    example: true,
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
    if (value === false || value === 'false' || value === '0' || value === 0) {
      return false;
    }
    return value;
  })
  isPrimary: boolean = false;
}
