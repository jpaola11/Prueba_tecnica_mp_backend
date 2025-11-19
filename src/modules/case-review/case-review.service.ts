// src/modules/case-review/case-review.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { CaseReviewRepository } from './case-review.repository';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';
import { CaseReviewQueryDto } from './dto/query-case-rewiew.dto';

class DomainError extends Error {
  readonly userMessage: string;
  readonly internalMessage: string;
  readonly statusCode: number;

  constructor(userMessage: string, internalMessage: string, statusCode = 400) {
    super(internalMessage);
    this.name = 'DomainError';
    this.userMessage = userMessage;
    this.internalMessage = internalMessage;
    this.statusCode = statusCode;
  }
}

@Injectable()
export class CaseReviewService {
  private readonly logger = new Logger(CaseReviewService.name);

  constructor(private readonly caseReviewRepository: CaseReviewRepository) {}

  async registerReview(
    dto: CreateCaseReviewDto,
    currentUserId: number,
  ): Promise<{ message: string; reviewId: number }> {
    try {
      if (dto.previousStatusId === dto.newStatusId) {
        throw new DomainError(
          'El nuevo estado debe ser diferente al estado anterior.',
          `Intento de registrar revisión con estados iguales. caseId=${dto.caseId}, statusId=${dto.previousStatusId}`,
          409,
        );
      }

      const reviewId = await this.caseReviewRepository.insert(
        dto,
        currentUserId,
      );

      return {
        message: 'Revisión registrada correctamente.',
        reviewId,
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al registrar revisión de expediente. SP: usp_CaseReview_Insert',
        error,
      );
    }
  }

  async listReviewsByCase(
    query: CaseReviewQueryDto,
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const caseId = (query as any).caseId;

      if (!caseId || typeof caseId !== 'number') {
        throw new DomainError(
          'Debe especificarse el identificador del expediente.',
          `CaseReviewQueryDto sin caseId válido. caseId=${caseId}`,
          400,
        );
      }

      const page =
        typeof (query as any).page === 'number' && (query as any).page > 0
          ? (query as any).page
          : 1;

      const limit =
        typeof (query as any).limit === 'number' && (query as any).limit > 0
          ? (query as any).limit
          : 20;

      const rows = await this.caseReviewRepository.listByCase(caseId);
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const items = rows
        .slice(start, end)
        .map((row) => this.mapDbReviewToResponse(row));

      return {
        items,
        total,
        page,
        limit,
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al listar revisiones de expediente. SP: usp_CaseReview_ListByCase',
        error,
      );
    }
  }

  private mapDbReviewToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.crv_id ?? row.id,
      caseId: row.crv_case_id ?? row.caseId,
      reviewerId: row.crv_reviewer_id ?? row.reviewerId,
      previousStatusId:
        row.crv_previous_status_id ?? row.previousStatusId ?? null,
      newStatusId: row.crv_new_status_id ?? row.newStatusId ?? null,
      comment: row.crv_comment ?? row.comment ?? null,
      reviewedAt: row.crv_reviewed_at ?? row.reviewedAt,
      createdAt: row.crv_created_at ?? row.createdAt,
      createdBy: row.crv_created_by ?? row.createdBy,
      updatedAt: row.crv_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.crv_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.crv_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.crv_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.crv_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      CaseReviewService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }
}
