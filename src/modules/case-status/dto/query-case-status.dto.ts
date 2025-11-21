import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class CaseStatusQueryBaseDto extends PaginationQueryDto {}

export class CaseStatusQueryDto extends IntersectionType(
  CaseStatusQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar estados por código, nombre o descripción',
    example: 'Abierto',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  search?: string;

  @ApiPropertyOptional({
    name: 'isFinal',
    description:
      'Indica si se deben filtrar solo estados finales (true), no finales (false) o todos (omitido)',
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
  isFinal?: boolean;

  @ApiPropertyOptional({
    name: 'orderMin',
    description:
      'Valor mínimo del orden para filtrar estados dentro de un rango de secuencia',
    example: 1,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  orderMin?: number;

  @ApiPropertyOptional({
    name: 'orderMax',
    description:
      'Valor máximo del orden para filtrar estados dentro de un rango de secuencia',
    example: 10,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  orderMax?: number;
}
