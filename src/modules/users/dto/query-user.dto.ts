import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class UserQueryBaseDto extends PaginationQueryDto {}

export class UserQueryDto extends IntersectionType(
  UserQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar por nombre completo, nombre de usuario o correo electrónico',
    example: 'Pérez',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  search?: string;

  @ApiPropertyOptional({
    name: 'orgUnitId',
    description:
      'Identificador de la unidad organizacional para filtrar los usuarios que pertenecen a ella',
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
    name: 'roleId',
    description:
      'Identificador de rol para filtrar usuarios que tienen asignado dicho rol',
    example: 3,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  roleId?: number;

  @ApiPropertyOptional({
    name: 'mustChangePassword',
    description:
      'Indica si se deben filtrar usuarios que requieren cambiar su contraseña en el próximo inicio de sesión (true/false)',
    example: false,
    default: null,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return undefined;
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
  mustChangePassword?: boolean;
}
