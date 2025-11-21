// src/modules/evidence/evidence.repository.ts
import { DataSource } from 'typeorm';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/evidence.update.dto';

export class EvidenceRepository {
  constructor(private readonly dataSource: DataSource) {}

  async insert(
    dto: CreateEvidenceDto,
    currentUserId: number,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @evd_id_out INT;

      EXEC dbo.usp_Evidence_Insert
        @evd_case_id      = @0,
        @evd_seq_number   = @1,
        @evd_description  = @2,
        @evd_color        = @3,
        @evd_size_text    = @4,
        @evd_weight_value = @5,
        @evd_weight_unit  = @6,
        @evd_location     = @7,
        @evd_technician_id= @8,
        @evd_observations = @9,
        @evd_created_by   = @10,
        @evd_id_out       = @evd_id_out OUTPUT;

      SELECT @evd_id_out AS evd_id;
      `,
      [
        dto.caseId,
        dto.sequenceNumber,
        dto.description,
        dto.color ?? null,
        dto.sizeText ?? null,
        dto.weightValue ?? null,
        dto.weightUnit ?? null,
        dto.location ?? null,
        dto.technicianId,
        dto.observations ?? null,
        currentUserId,
      ],
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.evd_id == null) {
      throw new Error(
        'La ejecución de usp_Evidence_Insert no devolvió evd_id.',
      );
    }

    return Number(row.evd_id);
  }

  async update(
    id: number,
    dto: UpdateEvidenceDto,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_Evidence_Update
        @evd_id          = @0,
        @evd_seq_number  = @1,
        @evd_description = @2,
        @evd_color       = @3,
        @evd_size_text   = @4,
        @evd_weight_value= @5,
        @evd_weight_unit = @6,
        @evd_location    = @7,
        @evd_observations= @8,
        @evd_updated_by  = @9;
      `,
      [
        id,
        dto.sequenceNumber,
        dto.description,
        dto.color ?? null,
        dto.sizeText ?? null,
        dto.weightValue ?? null,
        dto.weightUnit ?? null,
        dto.location ?? null,
        dto.observations ?? null,
        currentUserId,
      ],
    );
  }

  async listByCase(caseId: number): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_Evidence_ListByCase
        @evd_case_id = @0;
      `,
      [caseId],
    );

    return Array.isArray(rows) ? rows : [];
  }

  async softDelete(id: number, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_Evidence_SoftDelete
        @evd_id        = @0,
        @evd_deleted_by= @1;
      `,
      [id, currentUserId],
    );
  }

  
  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_Evidence_GetById
        @evi_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
  
}
