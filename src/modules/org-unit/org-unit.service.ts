import { Injectable, Logger } from '@nestjs/common';
import { OrgUnitRepository } from './org-unit.repository';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/org-unit.update.dto';
import { OrgUnitQueryDto } from './dto/query-unit.dto';

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
export class OrgUnitService {
  private readonly logger = new Logger(OrgUnitService.name);

  constructor(private readonly orgUnitRepository: OrgUnitRepository) {}

  async createOrgUnit(
    dto: CreateOrgUnitDto,
    currentUserId: number,
  ): Promise<{ message: string; orgUnitId: number }> {
    try {
      const orgUnitId = await this.orgUnitRepository.create(dto, currentUserId);

      return {
        message: 'Unidad organizacional creada correctamente.',
        orgUnitId,
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_OrgUnit') ||
        msg.includes('UQ_OrgUnit') ||
        msg.includes('UNIQUE')
      ) {
        const domainError = new DomainError(
          'Ya existe una unidad organizacional con ese código.',
          `Violación de índice único al crear unidad organizacional. code=${dto.code}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al crear unidad organizacional. SP: usp_OrgUnit_Insert',
        error,
      );
    }
  }

  async updateOrgUnit(
    id: number,
    dto: UpdateOrgUnitDto,
    currentUserId: number,
  ): Promise<{ message: string; orgUnit: any }> {
    try {
      const existing = await this.ensureOrgUnitExists(id);

      if (existing.org_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'La unidad organizacional fue eliminada y no puede modificarse.',
          `Intento de actualizar unidad organizacional eliminada. org_id=${id}`,
          409,
        );
      }

      await this.orgUnitRepository.update(id, dto, currentUserId);

      const updated = await this.orgUnitRepository.getById(id);
      const orgUnitResponse = this.mapDbOrgUnitToResponse(updated ?? existing);

      return {
        message: 'Unidad organizacional actualizada correctamente.',
        orgUnit: orgUnitResponse,
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_OrgUnit') ||
        msg.includes('UQ_OrgUnit') ||
        msg.includes('UNIQUE')
      ) {
        const domainError = new DomainError(
          'Ya existe una unidad organizacional con ese código.',
          `Violación de índice único al actualizar unidad organizacional. id=${id}, code=${dto.code}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al actualizar unidad organizacional. SP: usp_OrgUnit_Update',
        error,
      );
    }
  }

  async getOrgUnitById(id: number): Promise<any> {
    try {
      const row = await this.ensureOrgUnitExists(id);
      return this.mapDbOrgUnitToResponse(row);
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError(
        'Error técnico al obtener unidad organizacional. SP: usp_OrgUnit_GetById',
        error,
      );
    }
  }

  async listOrgUnits(
    query: OrgUnitQueryDto,
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    try {
      const page =
        typeof (query as any).page === 'number' && (query as any).page > 0
          ? (query as any).page
          : 1;

      const limit =
        typeof (query as any).limit === 'number' && (query as any).limit > 0
          ? (query as any).limit
          : 50;

      const rows = await this.orgUnitRepository.listActive();
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const items = rows
        .slice(start, end)
        .map((row) => this.mapDbOrgUnitToResponse(row));

      return {
        items,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al listar unidades organizacionales activas. SP: usp_OrgUnit_ListActive',
        error,
      );
    }
  }

  async softDeleteOrgUnit(
    id: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      const existing = await this.ensureOrgUnitExists(id);

      if (existing.org_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'La unidad organizacional ya se encuentra eliminada.',
          `Soft delete repetido sobre unidad organizacional. org_id=${id}`,
          409,
        );
      }

      await this.orgUnitRepository.softDelete(id, currentUserId);

      return {
        message: 'Unidad organizacional eliminada correctamente.',
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe')) {
        const domainError = new DomainError(
          'La unidad organizacional no existe o ya fue eliminada.',
          `Intento de eliminar unidad organizacional inexistente. org_id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al eliminar unidad organizacional. SP: usp_OrgUnit_SoftDelete',
        error,
      );
    }
  }

  private async ensureOrgUnitExists(id: number): Promise<any> {
    const row = await this.orgUnitRepository.getById(id);

    if (!row) {
      throw new DomainError(
        'La unidad organizacional no existe.',
        `OrgUnit no encontrada para id=${id}`,
        404,
      );
    }

    return row;
  }

  private mapDbOrgUnitToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.org_id ?? row.id,
      parentId: row.org_parent_id ?? row.parentId ?? null,
      code: row.org_code ?? row.code,
      name: row.org_name ?? row.name,
      description: row.org_description ?? row.description ?? null,
      isActive: row.org_is_active ?? row.isActive ?? true,
      createdAt: row.org_created_at ?? row.createdAt,
      createdBy: row.org_created_by ?? row.createdBy,
      updatedAt: row.org_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.org_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.org_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.org_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.org_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      OrgUnitService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }
}
