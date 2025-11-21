import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
  } from '@nestjs/swagger';
  import { Request } from 'express';
  
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { AuditLogService } from './audit-log.service';
  import { CreateAuditLogDto } from './dto/create-audit-log.dto';
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class RegisterSimpleAuditLogDto {
    tableName!: string;
    recordPk!: string | number;
    operation!: string;
    oldValues?: unknown;
    newValues?: unknown;
    sourceIp?: string;
    userAgent?: string;
    correlationId?: string;
  }
  
  @ApiTags('Logs de auditoría')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('audit-logs')
  export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Registrar log de auditoría',
      description:
        'Registra un nuevo log de auditoría con la información completa proporcionada en el cuerpo de la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Log de auditoría registrado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos del log de auditoría.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar registrar el log de auditoría.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateAuditLogDto,
    ): Promise<GenericMessageResponseDto> {
      await this.auditLogService.register(dto);
      return { message: 'Log de auditoría registrado correctamente.' };
    }
  
    @Post('simple')
    @ApiOperation({
      summary: 'Registrar log de auditoría simplificado',
      description:
        'Registra un log de auditoría utilizando una estructura simplificada; el usuario autenticado se asocia automáticamente al registro.',
    })
    @ApiResponse({
      status: 201,
      description: 'Log de auditoría simplificado registrado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos del log de auditoría simplificado.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar registrar el log de auditoría simplificado.',
      type: GenericMessageResponseDto,
    })
    async createSimple(
      @Body() dto: RegisterSimpleAuditLogDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
  
      await this.auditLogService.registerSimple({
        tableName: dto.tableName,
        recordPk: dto.recordPk,
        operation: dto.operation,
        userId: Number.isFinite(currentUserId) ? currentUserId : undefined,
        oldValues: dto.oldValues,
        newValues: dto.newValues,
        sourceIp: dto.sourceIp,
        userAgent: dto.userAgent,
        correlationId: dto.correlationId,
      });
  
      return { message: 'Log de auditoría simplificado registrado correctamente.' };
    }
  }
  