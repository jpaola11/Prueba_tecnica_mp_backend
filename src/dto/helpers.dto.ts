import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Helper de paginación reutilizable en listados.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    name: 'page',
    description: 'Número de página (base 1) para la paginación',
    example: 1,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : 1,
  )
  page?: number = 1;

  @ApiPropertyOptional({
    name: 'limit',
    description: 'Cantidad de registros a devolver por página',
    example: 20,
    default: 20,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : 20,
  )
  limit?: number = 20;
}

/**
 * Helper de rango de fechas para filtros y reportes.
 */
export class DateRangeQueryDto {
  @ApiPropertyOptional({
    name: 'dateFrom',
    description:
      'Fecha inicial del rango en formato ISO 8601 (incluyente en el filtro)',
    example: '2025-01-01',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    name: 'dateTo',
    description:
      'Fecha final del rango en formato ISO 8601 (normalmente hasta fin de día)',
    example: '2025-01-31',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

/**
 * Helper para indicar si solo se deben incluir registros activos.
 */
export class OnlyActiveQueryDto {
  @ApiPropertyOptional({
    name: 'onlyActive',
    description:
      'Indica si solo se deben devolver registros activos (true/false)',
    example: true,
    default: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return true;
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
  onlyActive?: boolean = true;
}

/**
 * Helper genérico para parámetros de ruta basados en un ID numérico.
 */
export class IdParamDto {
  @ApiProperty({
    name: 'id',
    description: 'Identificador numérico del recurso en la ruta',
    example: 123,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  id!: number;
}

/**
 * Helper para operaciones masivas que reciben un arreglo de IDs numéricos.
 */
export class IdsBodyDto {
  @ApiProperty({
    name: 'ids',
    description: 'Listado de identificadores numéricos a procesar',
    example: [1, 2, 3],
    default: [],
    type: [Number],
  })
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return value.split(',').map((v) => Number(v.trim()));
    }
    return [];
  })
  ids!: number[];
}
