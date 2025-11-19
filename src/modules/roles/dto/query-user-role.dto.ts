import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class UserRoleQueryBaseDto extends PaginationQueryDto {}

export class UserRoleQueryDto extends IntersectionType(
  UserRoleQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'userId',
    description:
      'Identificador del usuario para filtrar los roles asociados a esa cuenta',
    example: 15,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  userId?: number;

  @ApiPropertyOptional({
    name: 'roleId',
    description:
      'Identificador del rol para filtrar usuarios que poseen dicho rol',
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
    name: 'isPrimary',
    description:
      'Indica si se deben filtrar solo roles marcados como principales (true), no principales (false) o todos (omitido)',
    example: true,
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
  isPrimary?: boolean;
}
