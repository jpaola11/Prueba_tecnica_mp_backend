import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  OnlyActiveQueryDto,
} from '../../../dto/helpers.dto';

class OrgUnitQueryBaseDto extends PaginationQueryDto {}

export class OrgUnitQueryDto extends IntersectionType(
  OrgUnitQueryBaseDto,
  OnlyActiveQueryDto,
) {
  @ApiPropertyOptional({
    name: 'search',
    description:
      'Texto de búsqueda para filtrar por código o nombre de la unidad organizacional',
    example: 'Fiscalía',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  search?: string;

  @ApiPropertyOptional({
    name: 'parentId',
    description:
      'Identificador de la unidad organizacional padre para filtrar sus unidades hijas directas',
    example: 5,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  parentId?: number;
}
