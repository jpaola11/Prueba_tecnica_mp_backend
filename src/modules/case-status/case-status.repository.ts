import { DataSource } from 'typeorm';
import { CreateCaseStatusDto } from './dto/create-case-status.dto';
import { UpdateCaseStatusDto } from './dto/case-status.update.dto';

export class CaseStatusRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(
    dto: CreateCaseStatusDto,
    currentUserId: number,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @cst_id_out INT;

      EXEC dbo.usp_CaseStatus_Insert
        @cst_code        = @0,
        @cst_name        = @1,
        @cst_description = @2,
        @cst_is_final    = @3,
        @cst_order       = @4,
        @cst_created_by  = @5,
        @cst_id_out      = @cst_id_out OUTPUT;

      SELECT @cst_id_out AS cst_id;
      `,
      [
        dto.code,
        dto.name,
        dto.description ?? null,
        dto.isFinal ?? false,
        dto.order ?? null,
        currentUserId,
      ],
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.cst_id == null) {
      throw new Error(
        'La ejecución de usp_CaseStatus_Insert no devolvió cst_id.',
      );
    }

    return Number(row.cst_id);
  }

  async update(
    id: number,
    dto: UpdateCaseStatusDto,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_CaseStatus_Update
        @cst_id         = @0,
        @cst_name       = @1,
        @cst_description= @2,
        @cst_is_final   = @3,
        @cst_order      = @4,
        @cst_updated_by = @5;
      `,
      [
        id,
        dto.name,
        dto.description ?? null,
        dto.isFinal ?? false,
        dto.order,
        currentUserId,
      ],
    );
  }

  async listActive(): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseStatus_ListActive;
      `,
    );

    return Array.isArray(rows) ? rows : [];
  }

  async softDelete(id: number, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_CaseStatus_SoftDelete
        @cst_id        = @0,
        @cst_deleted_by= @1;
      `,
      [id, currentUserId],
    );
  }
  
  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseStatus_GetById
        @sta_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
  
}
