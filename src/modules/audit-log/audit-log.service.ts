import { Injectable, Logger } from '@nestjs/common';
import { AuditLogRepository } from './audit-log.repository';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async register(dto: CreateAuditLogDto): Promise<void> {
    try {
      await this.auditLogRepository.insert(dto);
    } catch (error) {
      const internalMessage = `Error técnico al registrar log de auditoría. SP: usp_AuditLog_Insert. Detalle: ${
        (error as Error)?.message ?? String(error)
      }`;

      this.logger.error(
        internalMessage,
        (error as Error)?.stack,
        AuditLogService.name,
      );
    }
  }

  async registerSimple(params: {
    tableName: string;
    recordPk: string | number;
    operation: string;
    userId?: number;
    oldValues?: unknown;
    newValues?: unknown;
    sourceIp?: string;
    userAgent?: string;
    correlationId?: string;
  }): Promise<void> {
    const {
      tableName,
      recordPk,
      operation,
      userId,
      oldValues,
      newValues,
      sourceIp,
      userAgent,
      correlationId,
    } = params;

    const dto: CreateAuditLogDto = {
      tableName,
      recordPk: String(recordPk),
      operation,
      userId,
      oldValues:
        typeof oldValues === 'string'
          ? oldValues
          : oldValues != null
          ? JSON.stringify(oldValues)
          : null,
      newValues:
        typeof newValues === 'string'
          ? newValues
          : newValues != null
          ? JSON.stringify(newValues)
          : null,
      sourceIp: sourceIp ?? null,
      userAgent: userAgent ?? null,
      correlationId: correlationId ?? null,
    };

    await this.register(dto);
  }
}
