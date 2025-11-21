import { DataSource } from 'typeorm';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

export class AuditLogRepository {
  constructor(private readonly dataSource: DataSource) {}

  async insert(dto: CreateAuditLogDto): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_AuditLog_Insert
        @log_table_name    = @0,
        @log_record_pk     = @1,
        @log_operation     = @2,
        @log_user_id       = @3,
        @log_old_values    = @4,
        @log_new_values    = @5,
        @log_source_ip     = @6,
        @log_user_agent    = @7,
        @log_correlation_id= @8;
      `,
      [
        dto.tableName,
        dto.recordPk,
        dto.operation,
        dto.userId ?? null,
        dto.oldValues ?? null,
        dto.newValues ?? null,
        dto.sourceIp ?? null,
        dto.userAgent ?? null,
        dto.correlationId ?? null,
      ]
    );
  }

  async findAll(): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_AuditLog_List;
      `
    );
    return rows;
  }

  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_AuditLog_GetById
        @log_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
}
