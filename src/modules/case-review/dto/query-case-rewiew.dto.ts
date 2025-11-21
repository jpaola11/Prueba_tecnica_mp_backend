import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Length, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  DateRangeQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class CaseReviewQueryBaseDto extends IntersectionType(
  PaginationQueryDto,
  DateRangeQueryDto,
) {}

export class CaseReviewQueryDto extends IntersectionType(
  CaseReviewQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'caseId',
    description:
      'Identificador del expediente para filtrar las revisiones asociadas',
    example: 120,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  caseId?: number;

  @ApiPropertyOptional({
    name: 'reviewerId',
    description:
      'Identificador del usuario revisor para filtrar las revisiones realizadas por esa persona',
    example: 42,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  reviewerId?: number;

  @ApiPropertyOptional({
    name: 'previousStatusId',
    description:
      'Identificador del estado previo del expediente para filtrar revisiones que parten de ese estado',
    example: 1,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  previousStatusId?: number;

  @ApiPropertyOptional({
    name: 'newStatusId',
    description:
      'Identificador del nuevo estado del expediente para filtrar revisiones que terminan en ese estado',
    example: 2,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  newStatusId?: number;

  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar revisiones por contenido del comentario',
    example: 'hallazgos adicionales',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  search?: string;

  @ApiPropertyOptional({
      name: 'fromDate',
      description:
        'Fecha de apertura en formato ISO 8601. Si se omite, el servidor asigna la fecha actual',
      example: '2025-11-18T10:30:00Z',
      default: null,
      type: String,
    })
    @IsOptional()
    @IsDateString()
    fromDate?: string;
  
    @ApiPropertyOptional({
      name: 'toDate',
      description:
        'Fecha de apertura en formato ISO 8601. Si se omite, el servidor asigna la fecha actual',
      example: '2025-11-18T10:30:00Z',
      default: null,
      type: String,
    })
    @IsOptional()
    @IsDateString()
    toDate?: string;
}
