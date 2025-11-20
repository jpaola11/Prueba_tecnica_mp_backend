// src/modules/role/role.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/role.update.dto';

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
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(
    dto: CreateRoleDto,
    currentUserId: number,
  ): Promise<{ message: string; roleId: number }> {
    try {
      const roleId = await this.roleRepository.create(dto, currentUserId);

      return {
        message: 'Rol creado correctamente.',
        roleId,
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_Role') ||
        msg.includes('UQ_Role') ||
        msg.includes('UNIQUE') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('duplicada') ||
        msg.toLowerCase().includes('duplicado')
      ) {
        const domainError = new DomainError(
          'Ya existe un rol con ese código.',
          `Violación de índice único al crear rol. code=${dto.code}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al crear rol. SP: usp_Role_Insert',
        error,
      );
    }
  }

  async updateRole(
    id: number,
    dto: UpdateRoleDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      await this.roleRepository.update(id, dto, currentUserId);

      return {
        message: 'Rol actualizado correctamente.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.toLowerCase().includes('no existe') ||
        msg.toLowerCase().includes('not found')
      ) {
        const domainError = new DomainError(
          'El rol no existe.',
          `Intento de actualizar rol inexistente. id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      if (
        msg.includes('IX_Role') ||
        msg.includes('UQ_Role') ||
        msg.includes('UNIQUE') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('duplicada') ||
        msg.toLowerCase().includes('duplicado')
      ) {
        const domainError = new DomainError(
          'Ya existe un rol con ese código.',
          `Violación de índice único al actualizar rol. id=${id}, code=${dto.code}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al actualizar rol. SP: usp_Role_Update',
        error,
      );
    }
  }

  async listActiveRoles(): Promise<{ items: any[]; total: number }> {
    try {
      const rows = await this.roleRepository.listActive();
      const items = rows.map((row) => this.mapDbRoleToResponse(row));

      return {
        items,
        total: items.length,
      };
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al listar roles activos. SP: usp_Role_ListActive',
        error,
      );
    }
  }

  async softDeleteRole(
    id: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      await this.roleRepository.softDelete(id, currentUserId);

      return {
        message: 'Rol eliminado correctamente.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.toLowerCase().includes('no existe') ||
        msg.toLowerCase().includes('not found')
      ) {
        const domainError = new DomainError(
          'El rol no existe o ya fue eliminado.',
          `Intento de eliminar rol inexistente. id=${id}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al eliminar rol. SP: usp_Role_SoftDelete',
        error,
      );
    }
  }

  private mapDbRoleToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.rol_id ?? row.id,
      code: row.rol_code ?? row.code,
      name: row.rol_name ?? row.name,
      description: row.rol_description ?? row.description ?? null,
      isDefault: row.rol_is_default ?? row.isDefault ?? false,
      createdAt: row.rol_created_at ?? row.createdAt,
      createdBy: row.rol_created_by ?? row.createdBy,
      updatedAt: row.rol_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.rol_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.rol_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.rol_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.rol_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      RoleService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }
}
