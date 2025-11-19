import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCaseReviewDto {
  @ApiProperty({
    name: 'caseId',
    description: 'Identificador del expediente al que pertenece la revisión',
    example: 120,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  caseId!: number;

  @ApiProperty({
    name: 'reviewerId',
    description: 'Identificador del usuario que realiza la revisión del caso',
    example: 42,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  reviewerId!: number;

  @ApiProperty({
    name: 'previousStatusId',
    description:
      'Identificador del estado previo del expediente antes de la revisión',
    example: 1,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  previousStatusId!: number;

  @ApiProperty({
    name: 'newStatusId',
    description:
      'Identificador del nuevo estado del expediente después de la revisión',
    example: 2,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  newStatusId!: number;

  @ApiPropertyOptional({
    name: 'comment',
    description:
      'Comentario u observaciones del revisor respecto al cambio de estado del expediente',
    example:
      'Se cambia el estado a EN INVESTIGACIÓN por hallazgos adicionales en la escena',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  comment?: string;

  @ApiPropertyOptional({
    name: 'reviewedAt',
    description:
      'Fecha y hora de la revisión en formato ISO 8601. Si se omite, el servidor asigna la fecha actual',
    example: '2025-11-18T15:45:00Z',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  reviewedAt?: string;
}
