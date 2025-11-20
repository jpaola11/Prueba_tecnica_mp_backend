import { Injectable, Logger } from '@nestjs/common';
import { CaseStatusRepository } from './case-status.repository';
import { CreateCaseStatusDto } from './dto/create-case-status.dto';
import { UpdateCaseStatusDto } from './dto/case-status.update.dto';

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
export class CaseStatusService {
  private readonly logger = new Logger(CaseStatusService.name);

  constructor(private readonly caseStatusRepository: CaseStatusRepository) {}

  async createStatus(
    dto: CreateCaseStatusDto,
    currentUserId: number,
  ): Promise<{ message: string; statusId: number }> {
    try {
      const statusId = await this.caseStatusRepository.create(
        dto,
        currentUserId,
      );

      return {
        message: 'Estado de expediente creado correctamente.',
        statusId,
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_CaseStatus') ||
        msg.includes('UQ_CaseStatus') ||
        msg.includes('UNIQUE')
      ) {
        const domainError = new DomainError(
          'Ya existe un estado de expediente con ese código.',
          `Violación de índice único al crear estado de expediente. code=${dto.code}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al crear estado de expediente. SP: usp_CaseStatus_Insert',
        error,
      );
    }
  }

  async updateStatus(
    id: number,
    dto: UpdateCaseStatusDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      await this.caseStatusRepository.update(id, dto, currentUserId);

      return {
        message: 'Estado de expediente actualizado correctamente.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe')) {
        const domainError = new DomainError(
          'El estado de expediente no existe.',
          `Intento de actualizar estado de expediente inexistente. id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al actualizar estado de expediente. SP: usp_CaseStatus_Update',
        error,
      );
    }
  }

  async listActiveStatuses(): Promise<{ items: any[]; total: number }> {
    try {
      const rows = await this.caseStatusRepository.listActive();
      const items = rows.map((row) => this.mapDbStatusToResponse(row));

      return {
        items,
        total: items.length,
      };
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al listar estados de expediente activos. SP: usp_CaseStatus_ListActive',
        error,
      );
    }
  }

  async softDeleteStatus(
    id: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      await this.caseStatusRepository.softDelete(id, currentUserId);

      return {
        message: 'Estado de expediente eliminado correctamente.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe')) {
        const domainError = new DomainError(
          'El estado de expediente no existe o ya fue eliminado.',
          `Intento de eliminar estado de expediente inexistente. id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al eliminar estado de expediente. SP: usp_CaseStatus_SoftDelete',
        error,
      );
    }
  }

  private mapDbStatusToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.cst_id ?? row.id,
      code: row.cst_code ?? row.code,
      name: row.cst_name ?? row.name,
      description: row.cst_description ?? row.description ?? null,
      isFinal: row.cst_is_final ?? row.isFinal ?? false,
      order: row.cst_order ?? row.order,
      createdAt: row.cst_created_at ?? row.createdAt,
      createdBy: row.cst_created_by ?? row.createdBy,
      updatedAt: row.cst_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.cst_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.cst_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.cst_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.cst_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      CaseStatusService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }
}
