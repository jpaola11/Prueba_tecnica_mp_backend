import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class RoleQueryBaseDto extends PaginationQueryDto {}

export class RoleQueryDto extends IntersectionType(
  RoleQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar roles por código, nombre o descripción',
    example: 'admin',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  search?: string;

  @ApiPropertyOptional({
    name: 'isDefault',
    description:
      'Indica si se deben incluir solo roles predeterminados (true), no predeterminados (false) o todos (omitido)',
    example: false,
    default: null,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return undefined;
    if (value === true || value === 'true' || value === '1' || value === 1)
      return true;
    if (value === false || value === 'false' || value === '0' || value === 0)
      return false;
    return value;
  })
  isDefault?: boolean;
}
