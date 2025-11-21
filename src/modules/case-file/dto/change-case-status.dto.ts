import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsDateString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeCaseStatusDto {
 

  @ApiProperty({
    name: 'statusId',
    description: 'Identificador del nuevo estado que se asignará al expediente',
    example: 2,
    default: null,
    type: Number,
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  statusId!: number;

  @ApiPropertyOptional({
    name: 'comment',
    description: 'Comentario u observaciones que justifican el cambio de estado del expediente',
    example:
      'Se actualiza a EN INVESTIGACIÓN por nueva evidencia recopilada en el lugar de los hechos',
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
      'Fecha y hora en formato ISO 8601 en la que se realiza el cambio de estado; si se omite, el servidor asigna la fecha actual',
    example: '2025-11-18T15:45:00Z',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  reviewedAt?: string;
}
