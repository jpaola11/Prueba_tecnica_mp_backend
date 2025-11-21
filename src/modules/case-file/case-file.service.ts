import { Injectable, Logger } from '@nestjs/common';
import { CaseFileRepository } from './case-file.repository';
import { CreateCaseFileDto } from './dto/create-case-file.dto';
import { UpdateCaseFileDto } from './dto/case-file.upadate.dto';
import { CaseFileQueryDto } from './dto/query-case-file.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';

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
export class CaseFileService {
  private readonly logger = new Logger(CaseFileService.name);

  constructor(private readonly caseFileRepository: CaseFileRepository) {}

  async createCase(
    dto: CreateCaseFileDto,
    currentUserId: number,
  ): Promise<{ message: string; caseId: number }> {
    try {
      const newId = await this.caseFileRepository.insert(dto, currentUserId);

      return {
        message: 'Expediente creado correctamente.',
        caseId: newId,
      };
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al crear expediente. SP: usp_CaseFile_Insert',
        error,
      );
    }
  }

  async updateCase(
    id: number,
    dto: UpdateCaseFileDto,
    currentUserId: number,
  ): Promise<{ message: string; case: any }> {
    try {
      const existing = await this.ensureCaseExists(id);

      if (existing.cas_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'El expediente fue eliminado y no puede modificarse.',
          `Intento de actualizar expediente eliminado. cas_id=${id}`,
          409,
        );
      }

      await this.caseFileRepository.update(id, dto, currentUserId);

      const updated = await this.caseFileRepository.getById(id);
      const caseResponse = this.mapDbCaseToResponse(updated ?? existing);

      return {
        message: 'Expediente actualizado correctamente.',
        case: caseResponse,
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al actualizar expediente. SP: usp_CCaseFile_Update',
        error,
      );
    }
  }

  async getCaseById(id: number): Promise<any> {
    try {
      const row = await this.ensureCaseExists(id);
      return this.mapDbCaseToResponse(row);
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al obtener expediente. SP: usp_CaseFile_GetById',
        error,
      );
    }
  }

  async listCases(
    query: CaseFileQueryDto,
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const page =
        typeof (query as any).page === 'number' && (query as any).page > 0
          ? (query as any).page
          : 1;
      const limit =
        typeof (query as any).limit === 'number' && (query as any).limit > 0
          ? (query as any).limit
          : 20;

      const rows = await this.caseFileRepository.list(query);
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const items = rows
        .slice(start, end)
        .map((row) => this.mapDbCaseToResponse(row));

      return {
        items,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al listar expedientes. SP: usp_CaseFile_List',
        error,
      );
    }
  }

  async changeStatus(
    id: number,
    dto: ChangeCaseStatusDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      const existing = await this.ensureCaseExists(id);

      if (existing.cas_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'El expediente fue eliminado y no puede cambiar de estado.',
          `Intento de cambio de estado en expediente eliminado. cas_id=${id}`,
          409,
        );
      }

      const currentStatusId =
        existing.cas_status_id ?? existing.statusId ?? null;

      if (typeof currentStatusId === 'number') {
        this.validateStatusTransition(currentStatusId, dto.statusId);
      }

      await this.caseFileRepository.updateStatus(id, dto, currentUserId);

      return {
        message: 'Estado del expediente actualizado correctamente.',
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al cambiar estado del expediente. SP: usp_CaseFile_UpdateStatus',
        error,
      );
    }
  }

  async softDeleteCase(
    id: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      const existing = await this.ensureCaseExists(id);

      if (existing.cas_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'El expediente ya se encuentra eliminado.',
          `Soft delete repetido sobre expediente. cas_id=${id}`,
          409,
        );
      }

      await this.caseFileRepository.softDelete(id, currentUserId);

      return {
        message: 'Expediente eliminado correctamente.',
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al eliminar expediente. SP: usp_CaseFile_SoftDelete',
        error,
      );
    }
  }

  private async ensureCaseExists(id: number): Promise<any> {
    const row = await this.caseFileRepository.getById(id);

    if (!row) {
      throw new DomainError(
        'El expediente no existe.',
        `CaseFile no encontrado para id=${id}`,
        404,
      );
    }

    return row;
  }

  private validateStatusTransition(
    currentStatusId: number,
    newStatusId: number,
  ): void {
    if (currentStatusId === newStatusId) {
      throw new DomainError(
        'El expediente ya se encuentra en el estado solicitado.',
        `Transición de estado inválida: estado actual = nuevo. statusId=${currentStatusId}`,
        409,
      );
    }
  }

  private mapDbCaseToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.cas_id ?? row.id,
      code: row.cas_code ?? row.code,
      title: row.cas_title ?? row.title,
      description: row.cas_description ?? row.description ?? null,
      orgUnitId: row.cas_org_unit_id ?? row.orgUnitId ?? null,
      technicianId: row.cas_technician_id ?? row.technicianId,
      statusId: row.cas_status_id ?? row.statusId,
      openDate: row.cas_open_date ?? row.openDate,
      closeDate: row.cas_close_date ?? row.closeDate ?? null,
      referenceExternal:
        row.cas_reference_external ?? row.referenceExternal ?? null,
      createdAt: row.cas_created_at ?? row.createdAt,
      createdBy: row.cas_created_by ?? row.createdBy,
      updatedAt: row.cas_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.cas_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.cas_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.cas_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.cas_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      CaseFileService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }

  async findOne(id: number) {
    try {
      return await this.caseFileRepository.findOne(id);
    } catch (error) {
      const internalMessage = `Error técnico al obtener el expediente con id ${id}. Detalle: ${
        (error as Error)?.message ?? String(error)
      }`;
  
      this.logger.error(internalMessage, (error as Error)?.stack, CaseFileService.name);
  
      throw error;
    }
  }

  
}
