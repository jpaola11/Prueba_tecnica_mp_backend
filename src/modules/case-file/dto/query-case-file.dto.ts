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
  DateRangeQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class CaseFileQueryBaseDto extends IntersectionType(
  PaginationQueryDto,
  DateRangeQueryDto,
) {}

export class CaseFileQueryDto extends IntersectionType(
  CaseFileQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar por código, título, descripción o referencia externa del expediente',
    example: 'Puerto Barrios',
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
      'Identificador de la unidad organizacional responsable para filtrar expedientes',
    example: 3,
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
    name: 'technicianId',
    description:
      'Identificador del técnico responsable para filtrar expedientes asignados',
    example: 42,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  technicianId?: number;

  @ApiPropertyOptional({
    name: 'statusId',
    description:
      'Identificador del estado del expediente para filtrar por situación procesal',
    example: 1,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  statusId?: number;

  @ApiPropertyOptional({
    name: 'isOpen',
    description:
      'Indica si solo se deben incluir expedientes abiertos (true) o cerrados (false); si se omite, se incluyen ambos',
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
  isOpen?: boolean;
}
