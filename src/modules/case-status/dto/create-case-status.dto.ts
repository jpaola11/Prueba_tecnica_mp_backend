import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCaseStatusDto {
  @ApiProperty({
    name: 'code',
    description: 'Código único del estado de expediente',
    example: 'OPEN',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 50)
  code!: string;

  @ApiProperty({
    name: 'name',
    description: 'Nombre descriptivo del estado de expediente',
    example: 'Abierto',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiPropertyOptional({
    name: 'description',
    description:
      'Descripción breve del alcance o significado del estado de expediente',
    example: 'Expediente recién ingresado, pendiente de análisis inicial',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    name: 'isFinal',
    description:
      'Indica si el estado es final dentro del ciclo de vida del expediente',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === '') return false;
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
  isFinal?: boolean = false;

  @ApiProperty({
    name: 'order',
    description:
      'Orden de visualización o secuencia del estado dentro del flujo de trabajo',
    example: 1,
    default: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  order!: number;
}
