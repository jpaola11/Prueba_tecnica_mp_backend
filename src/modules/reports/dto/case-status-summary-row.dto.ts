 import { ApiProperty } from '@nestjs/swagger';

export class CaseStatusSummaryRowDto {
  @ApiProperty({
    description: 'Identificador de la unidad organizacional.',
    example: 5,
    type: Number,
  })
  orgUnitId!: number | null;

  @ApiProperty({
    description: 'Nombre de la unidad organizacional.',
    example: 'Fiscalía de Sección de Delitos Económicos',
    type: String,
  })
  orgUnitName!: string;

  @ApiProperty({
    description: 'Cantidad de expedientes en estado "Abierto" (statusId = 0).',
    example: 10,
    type: Number,
  })
  open!: number;

  @ApiProperty({
    description: 'Cantidad de expedientes en estado "En trámite" (statusId = 1).',
    example: 7,
    type: Number,
  })
  inProgress!: number;

  @ApiProperty({
    description:
      'Cantidad de expedientes cerrados (aprobado o rechazado, statusId IN (2,3)).',
    example: 3,
    type: Number,
  })
  closed!: number;

  @ApiProperty({
    description: 'Total de expedientes de la unidad en el rango de filtros.',
    example: 20,
    type: Number,
  })
  total!: number;
}
