// src/modules/case-file/case-file.repository.ts
import { DataSource } from 'typeorm';
import { CreateCaseFileDto } from './dto/create-case-file.dto';
import { UpdateCaseFileDto } from './dto/case-file.upadate.dto';
import { CaseFileQueryDto } from './dto/query-case-file.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';

export class CaseFileRepository {
  constructor(private readonly dataSource: DataSource) {}

  async insert(
    dto: CreateCaseFileDto,
    currentUserId: number,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @cas_id_out INT;

      EXEC dbo.usp_CaseFile_Insert
        @cas_code               = @0,
        @cas_title              = @1,
        @cas_description        = @2,
        @cas_org_unit_id        = @3,
        @cas_technician_id      = @4,
        @cas_status_id          = @5,
        @cas_open_date          = @6,
        @cas_reference_external = @7,
        @cas_created_by         = @8,
        @cas_id_out             = @cas_id_out OUTPUT;

      SELECT @cas_id_out AS cas_id;
      `,
      [
        dto.code,
        dto.title,
        dto.description ?? null,
        dto.orgUnitId ?? null,
        dto.technicianId,
        dto.statusId,
        dto.openDate ?? null,
        dto.referenceExternal ?? null,
        currentUserId,
      ],
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.cas_id == null) {
      throw new Error(
        'La ejecución de usp_CaseFile_Insert no devolvió cas_id.',
      );
    }

    return Number(row.cas_id);
  }

  async update(
    id: number,
    dto: UpdateCaseFileDto,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_CaseFile_Update
        @cas_id                = @0,
        @cas_title             = @1,
        @cas_description       = @2,
        @cas_org_unit_id       = @3,
        @cas_reference_external= @4,
        @new_status_id =@5
        @cas_updated_by        = @6;
      `,
      [
        id,
        dto.title ?? null,
        dto.description ?? null,
        dto.orgUnitId ?? null,
        dto.referenceExternal ?? null,
        dto.statusId ??null,
        currentUserId,
      ],
    );
  }

  async updateStatus(
    id: number,
    dto: ChangeCaseStatusDto,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_CaseFile_UpdateStatus
        @cas_id        = @0,
        @new_status_id = @1,
        @cas_updated_by= @2;
      `,
      [id, dto.statusId, currentUserId],
    );
  }

  async getById(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseFile_GetById
        @cas_id = @0;
      `,
      [id],
    );

    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async list(query: CaseFileQueryDto): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseFile_List
        @cas_code        = @0,
        @cas_status_id   = @1,
        @cas_org_unit_id = @2,
        @date_from       = @3;
      `,
      [
        query.code ?? null,
        query.statusId ?? null,
        query.orgUnitId ?? null,
        query.openDate ?? null,
      ],
    );

    return Array.isArray(rows) ? rows : [];
  }

  async softDelete(id: number, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_CaseFile_SoftDelete
        @cas_id        = @0,
        @cas_deleted_by= @1;
      `,
      [id, currentUserId],
    );
  }

  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseFile_GetById
        @cas_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
  

 
  
}



