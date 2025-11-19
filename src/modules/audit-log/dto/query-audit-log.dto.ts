import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PaginationQueryDto,
  DateRangeQueryDto,
} from '../../../dto/helpers.dto';

class AuditLogQueryBaseDto extends IntersectionType(
  PaginationQueryDto,
  DateRangeQueryDto,
) {}

export class AuditLogQueryDto extends AuditLogQueryBaseDto {
  @ApiPropertyOptional({
    name: 'tableName',
    description:
      'Nombre de la tabla a filtrar dentro del historial de auditoría',
    example: 'CaseFile',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 128)
  tableName?: string;

  @ApiPropertyOptional({
    name: 'recordPk',
    description:
      'Identificador primario del registro para filtrar sus operaciones en el historial de auditoría',
    example: '123',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 64)
  recordPk?: string;

  @ApiPropertyOptional({
    name: 'operation',
    description:
      'Tipo de operación a filtrar en el historial de auditoría (INSERT, UPDATE, SOFT_DELETE, RESTORE, LOGIN, etc.)',
    example: 'UPDATE',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  operation?: string;

  @ApiPropertyOptional({
    name: 'userId',
    description:
      'Identificador del usuario que ejecutó las operaciones a filtrar en el historial de auditoría',
    example: 42,
    default: null,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value !== undefined && value !== '' ? Number(value) : undefined,
  )
  userId?: number;

  @ApiPropertyOptional({
    name: 'correlationId',
    description:
      'Identificador de correlación para filtrar operaciones vinculadas dentro de un mismo flujo',
    example: 'REQ-2025-11-18-XYZ',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  correlationId?: string;

  @ApiPropertyOptional({
    name: 'sourceIp',
    description:
      'Dirección IP de origen utilizada como criterio de filtro en el historial de auditoría',
    example: '192.168.0.10',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  sourceIp?: string;
}
