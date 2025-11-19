import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCaseFileDto {
  @ApiProperty({
    name: 'code',
    description: 'Código de expediente, único en la base de datos',
    example: 'DICRI-2025-000123',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  code!: string;

  @ApiProperty({
    name: 'title',
    description: 'Título corto o resumen del expediente',
    example: 'Caso de homicidio en Puerto Barrios',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 200)
  title!: string;

  @ApiPropertyOptional({
    name: 'description',
    description: 'Descripción detallada del expediente',
    example:
      'Evidencia recolectada en la escena del crimen ubicada en el barrio El Rastro de Puerto Barrios',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiPropertyOptional({
    name: 'orgUnitId',
    description: 'Identificador de la unidad organizacional responsable',
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

  @ApiProperty({
    name: 'technicianId',
    description: 'Identificador del técnico que registra el expediente',
    example: 42,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  technicianId!: number;

  @ApiProperty({
    name: 'statusId',
    description: 'Identificador del estado inicial del expediente',
    example: 1,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  statusId!: number;

  @ApiPropertyOptional({
    name: 'openDate',
    description:
      'Fecha de apertura en formato ISO 8601. Si se omite, el servidor asigna la fecha actual',
    example: '2025-11-18T10:30:00Z',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  openDate?: string;

  @ApiPropertyOptional({
    name: 'referenceExternal',
    description:
      'Referencia externa asociada al expediente (registro MP, número de documento, etc.)',
    example: 'MP-OFICIO-2025-789',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  referenceExternal?: string;
}
