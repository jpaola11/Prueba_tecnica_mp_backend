import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrgUnitDto {
  @ApiPropertyOptional({
    name: 'parentId',
    description:
      'Identificador de la unidad organizacional padre, si la unidad forma parte de una jerarquía',
    example: 1,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  parentId?: number;

  @ApiProperty({
    name: 'code',
    description:
      'Código único de la unidad organizacional dentro de la estructura institucional',
    example: 'FIS-PB-001',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 50)
  code!: string;

  @ApiProperty({
    name: 'name',
    description: 'Nombre oficial de la unidad organizacional',
    example: 'Fiscalía Distrital de Puerto Barrios',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 200)
  name!: string;

  @ApiPropertyOptional({
    name: 'description',
    description:
      'Descripción breve de las funciones o alcance de la unidad organizacional',
    example:
      'Unidad encargada de la investigación y persecución penal en el distrito de Puerto Barrios',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    name: 'isActive',
    description:
      'Indica si la unidad organizacional se encuentra activa para asignación de casos y usuarios',
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
  isActive?: boolean = true;
}
