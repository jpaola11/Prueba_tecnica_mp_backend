import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  DateRangeQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class EvidenceQueryBaseDto extends IntersectionType(
  PaginationQueryDto,
  DateRangeQueryDto,
) {}

export class EvidenceQueryDto extends IntersectionType(
  EvidenceQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'caseId',
    description:
      'Identificador del expediente para filtrar las evidencias asociadas',
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
    name: 'technicianId',
    description:
      'Identificador del técnico responsable para filtrar evidencias registradas por esa persona',
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
    name: 'seqNumberFrom',
    description:
      'Número secuencial mínimo para filtrar evidencias dentro de un rango',
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
  seqNumberFrom?: number;

  @ApiPropertyOptional({
    name: 'seqNumberTo',
    description:
      'Número secuencial máximo para filtrar evidencias dentro de un rango',
    example: 50,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  seqNumberTo?: number;

  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar evidencias por descripción, ubicación u observaciones',
    example: 'arma de fuego',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  search?: string;

  @ApiPropertyOptional({
    name: 'color',
    description:
      'Color de la evidencia utilizado como criterio de filtro',
    example: 'Negro',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  color?: string;
}
