import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEvidenceDto {
  @ApiProperty({
    name: 'caseId',
    description: 'Identificador del expediente al que pertenece la evidencia',
    example: 120,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  caseId!: number;

  @ApiProperty({
    name: 'seqNumber',
    description:
      'Número secuencial de la evidencia dentro del expediente',
    example: 1,
    default: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  seqNumber!: number;

  @ApiProperty({
    name: 'description',
    description:
      'Descripción detallada de la evidencia recolectada en el expediente',
    example:
      'Arma de fuego tipo pistola calibre 9mm localizada en el lugar de los hechos',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 1000)
  description!: string;

  @ApiPropertyOptional({
    name: 'color',
    description:
      'Color predominante de la evidencia, si es relevante para su identificación',
    example: 'Negro',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  color?: string;

  @ApiPropertyOptional({
    name: 'sizeText',
    description:
      'Descripción textual del tamaño o dimensiones aproximadas de la evidencia',
    example: 'Aproximadamente 20 cm de largo',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  sizeText?: string;

  @ApiPropertyOptional({
    name: 'weightValue',
    description:
      'Valor numérico del peso de la evidencia en la unidad indicada, como texto',
    example: '1.25',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  weightValue?: string;

  @ApiPropertyOptional({
    name: 'weightUnit',
    description:
      'Unidad de medida utilizada para el peso de la evidencia',
    example: 'kg',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  weightUnit?: string;

  @ApiPropertyOptional({
    name: 'location',
    description:
      'Ubicación específica donde fue encontrada o almacenada la evidencia',
    example: 'Sala principal de la vivienda, junto a la mesa',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  location?: string;

  @ApiProperty({
    name: 'technicianId',
    description:
      'Identificador del técnico responsable de levantar o registrar la evidencia',
    example: 42,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  technicianId!: number;

  @ApiPropertyOptional({
    name: 'observations',
    description:
      'Observaciones adicionales sobre el estado, manejo o particularidades de la evidencia',
    example:
      'Se embala en bolsa de evidencia sellada y etiquetada con el código correspondiente',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  observations?: string;
}
