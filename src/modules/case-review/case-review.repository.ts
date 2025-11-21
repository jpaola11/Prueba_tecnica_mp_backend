import { DataSource } from 'typeorm';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';

export class CaseReviewRepository {
  constructor(private readonly dataSource: DataSource) {}

  async insert(
    dto: CreateCaseReviewDto,
    currentUserId: number,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @crv_id_out INT;

      EXEC dbo.usp_CaseReview_Insert
        @crv_case_id           = @0,
        @crv_reviewer_id       = @1,
        @crv_previous_status_id= @2,
        @crv_new_status_id     = @3,
        @crv_comment           = @4,
        @crv_created_by        = @5,
        @crv_id_out            = @crv_id_out OUTPUT;

      SELECT @crv_id_out AS crv_id;
      `,
      [
        dto.caseId,
        dto.reviewerId,
        dto.previousStatusId,
        dto.newStatusId,
        dto.comment ?? null,
        currentUserId,
      ],
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.crv_id == null) {
      throw new Error(
        'La ejecución de usp_CaseReview_Insert no devolvió crv_id.',
      );
    }

    return Number(row.crv_id);
  }

  async listByCase(caseId: number): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseReview_ListByCase
        @crv_case_id = @0;
      `,
      [caseId],
    );

    return Array.isArray(rows) ? rows : [];
  }

  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_CaseReview_GetById
        @rev_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
    
}
