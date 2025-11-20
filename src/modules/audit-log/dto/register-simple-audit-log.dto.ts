import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterSimpleAuditLogDto {
  @ApiProperty({
    name: 'tableName',
    description: 'Nombre de la tabla donde ocurrió la operación auditada',
    example: 'CaseFile',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 128)
  tableName!: string;

  @ApiProperty({
    name: 'recordPk',
    description: 'Identificador primario del registro afectado',
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
      'Tipo de operación realizada (INSERT, UPDATE, DELETE, SOFT_DELETE, RESTORE, LOGIN, etc.)',
    example: 'UPDATE',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 20)
  operation!: string;

  @ApiPropertyOptional({
    name: 'oldValues',
    description:
      'Valores previos del registro antes de la operación (string JSON o estructura serializable)',
    example: '{"status":"OPEN"}',
    default: null,
    type: String,
  })
  @IsOptional()
  oldValues?: string;

  @ApiPropertyOptional({
    name: 'newValues',
    description:
      'Valores nuevos del registro después de la operación (string JSON o estructura serializable)',
    example: '{"status":"CLOSED"}',
    default: null,
    type: String,
  })
  @IsOptional()
  newValues?: string;

  @ApiPropertyOptional({
    name: 'sourceIp',
    description: 'Dirección IP desde donde se originó la operación auditada',
    example: '192.168.10.55',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  sourceIp?: string;

  @ApiPropertyOptional({
    name: 'userAgent',
    description: 'Cadena User-Agent enviada por el cliente durante la operación',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  userAgent?: string;

  @ApiPropertyOptional({
    name: 'correlationId',
    description:
      'Identificador de correlación para relacionar múltiples acciones dentro del mismo flujo',
    example: 'REQ-2025-11-18-XYZ',
    default: null,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  correlationId?: string;
}
