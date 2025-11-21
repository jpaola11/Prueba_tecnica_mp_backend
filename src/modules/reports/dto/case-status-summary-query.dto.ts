 import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CaseStatusSummaryQueryDto {
  @ApiPropertyOptional({
    name: 'orgUnitId',
    description: 'Identificador de la unidad organizacional a filtrar.',
    example: 5,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== null && value !== ''
      ? Number(value)
      : undefined,
  )
  orgUnitId?: number;

  @ApiPropertyOptional({
    name: 'status',
    description:
      'Estado agrupado: OPEN (abiertos), IN_PROGRESS (en trámite), CLOSED (cerrados: aprobados/rechazados).',
    example: 'OPEN',
    enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
  })
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'CLOSED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

  @ApiPropertyOptional({
    name: 'fromDate',
    description:
      'Fecha inicial (YYYY-MM-DD) para filtrar por fecha de apertura del expediente.',
    example: '2025-11-01',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    name: 'toDate',
    description:
      'Fecha final (YYYY-MM-DD) para filtrar por fecha de apertura del expediente.',
    example: '2025-11-30',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
