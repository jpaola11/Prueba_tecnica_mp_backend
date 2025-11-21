// src/modules/evidence/evidence.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { EvidenceRepository } from './evidence.repository';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/evidence.update.dto';
import { EvidenceQueryDto } from './dto/query-evidence.dto';

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
export class EvidenceService {
  private readonly logger = new Logger(EvidenceService.name);

  constructor(private readonly evidenceRepository: EvidenceRepository) {}

  async addEvidence(
    dto: CreateEvidenceDto,
    currentUserId: number,
  ): Promise<{ message: string; evidenceId: number }> {
    try {
      if (!dto.caseId || typeof dto.caseId !== 'number') {
        throw new DomainError(
          'Debe especificarse el expediente asociado a la evidencia.',
          `CreateEvidenceDto sin caseId válido. caseId=${dto.caseId}`,
          400,
        );
      }

      const evidenceId = await this.evidenceRepository.insert(
        dto,
        currentUserId,
      );

      return {
        message: 'Evidencia registrada correctamente.',
        evidenceId,
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_Evidence') ||
        msg.includes('UQ_Evidence') ||
        msg.includes('UNIQUE')
      ) {
        const domainError = new DomainError(
          'Ya existe una evidencia con ese número de secuencia para el expediente.',
          `Violación de índice único al crear evidencia. caseId=${dto.caseId}, seq=${dto.seqNumber}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al registrar evidencia. SP: usp_Evidence_Insert',
        error,
      );
    }
  }

  async updateEvidence(
    id: number,
    dto: UpdateEvidenceDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      await this.evidenceRepository.update(id, dto, currentUserId);

      return {
        message: 'Evidencia actualizada correctamente.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe')) {
        const domainError = new DomainError(
          'La evidencia no existe.',
          `Intento de actualizar evidencia inexistente. id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al actualizar evidencia. SP: usp_Evidence_Update',
        error,
      );
    }
  }

  async listEvidencesByCase(
    query: EvidenceQueryDto,
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
          `EvidenceQueryDto sin caseId válido. caseId=${caseId}`,
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

      const rows = await this.evidenceRepository.listByCase(caseId);
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const items = rows
        .slice(start, end)
        .map((row) => this.mapDbEvidenceToResponse(row));

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
        'Error técnico al listar evidencias del expediente. SP: usp_Evidence_ListByCase',
        error,
      );
    }
  }

  async softDeleteEvidence(
    id: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      await this.evidenceRepository.softDelete(id, currentUserId);

      return {
        message: 'Evidencia eliminada correctamente.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe')) {
        const domainError = new DomainError(
          'La evidencia no existe o ya fue eliminada.',
          `Intento de eliminar evidencia inexistente. id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al eliminar evidencia. SP: usp_Evidence_SoftDelete',
        error,
      );
    }
  }

  private mapDbEvidenceToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.evd_id ?? row.id,
      caseId: row.evd_case_id ?? row.caseId,
      sequenceNumber:
        row.evd_seq_number ?? row.seqNumber ?? row.sequenceNumber ?? null,
      description: row.evd_description ?? row.description,
      color: row.evd_color ?? row.color ?? null,
      sizeText: row.evd_size_text ?? row.sizeText ?? null,
      weightValue: row.evd_weight_value ?? row.weightValue ?? null,
      weightUnit: row.evd_weight_unit ?? row.weightUnit ?? null,
      location: row.evd_location ?? row.location ?? null,
      technicianId: row.evd_technician_id ?? row.technicianId,
      observations: row.evd_observations ?? row.observations ?? null,
      createdAt: row.evd_created_at ?? row.createdAt,
      createdBy: row.evd_created_by ?? row.createdBy,
      updatedAt: row.evd_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.evd_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.evd_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.evd_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.evd_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      EvidenceService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }

  async findOne(id: number) {
    try {
      return await this.evidenceRepository.findOne(id);
    } catch (error) {
      const internalMessage = `Error técnico al obtener la evidencia con id ${id}. Detalle: ${
        (error as Error)?.message ?? String(error)
      }`;
  
      this.logger.error(internalMessage, (error as Error)?.stack, EvidenceService.name);
  
      throw error;
    }
  }

  
}
