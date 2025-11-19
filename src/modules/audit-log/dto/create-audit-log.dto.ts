
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuditLogDto {
  @ApiProperty({
    name: 'tableName',
    description:
      'Nombre de la tabla en la que se realizó la operación auditada',
    example: 'CaseFile',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 128)
  tableName!: string;

  @ApiProperty({
    name: 'recordPk',
    description:
      'Identificador primario del registro afectado en la tabla auditada',
    example: '123',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 64)
  recordPk!: string;

  @ApiProperty({
    name: 'operation',
    description:
      'Tipo de operación realizada sobre el registro (INSERT, UPDATE, SOFT_DELETE, RESTORE, LOGIN, etc.)',
    example: 'UPDATE',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 20)
  operation!: string;

  @ApiPropertyOptional({
    name: 'operationAt',
    description:
      'Fecha y hora en que se realizó la operación en formato ISO 8601; si se omite, el servidor asigna la fecha actual',
    example: '2025-11-18T10:30:00Z',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  operationAt?: string;

  @ApiPropertyOptional({
    name: 'userId',
    description:
      'Identificador del usuario que ejecutó la operación, si aplica',
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
    name: 'oldValues',
    description:
      'Valores previos del registro en formato JSON antes de la operación',
    example: '{"name":"Valor anterior","status":"OPEN"}',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  oldValues?: string;

  @ApiPropertyOptional({
    name: 'newValues',
    description:
      'Valores nuevos del registro en formato JSON después de la operación',
    example: '{"name":"Valor actualizado","status":"CLOSED"}',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  newValues?: string;

  @ApiPropertyOptional({
    name: 'sourceIp',
    description:
      'Dirección IP de origen desde la que se ejecutó la operación auditada',
    example: '192.168.0.10',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  sourceIp?: string;

  @ApiPropertyOptional({
    name: 'userAgent',
    description:
      'Cadena de User-Agent del cliente que ejecutó la operación auditada',
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  userAgent?: string;

  @ApiPropertyOptional({
    name: 'correlationId',
    description:
      'Identificador de correlación para agrupar operaciones relacionadas dentro del flujo de auditoría',
    example: 'REQ-2025-11-18-XYZ',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  correlationId?: string;
}
