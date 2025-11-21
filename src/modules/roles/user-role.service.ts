// src/modules/user-role/user-role.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { UserRoleRepository } from './user-role.repository';
import { AssignUserRoleDto } from './dto/assign-user-role.dto';
import { RemoveUserRoleDto } from './dto/remove-user-role.dto';
import { UserRoleQueryDto } from './dto/query-user-role.dto';

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
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);

  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  async assignRole(
    dto: AssignUserRoleDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      if (!dto.userId || typeof dto.userId !== 'number') {
        throw new DomainError(
          'Debe especificarse el usuario al que se asignará el rol.',
          `AssignUserRoleDto sin userId válido. userId=${dto.userId}`,
          400,
        );
      }

      if (!dto.roleId || typeof dto.roleId !== 'number') {
        throw new DomainError(
          'Debe especificarse el rol a asignar.',
          `AssignUserRoleDto sin roleId válido. roleId=${dto.roleId}`,
          400,
        );
      }

      await this.userRoleRepository.assignRole(
        dto.userId,
        dto.roleId,
        dto.isPrimary ?? false,
        currentUserId,
      );

      return {
        message: 'Rol asignado correctamente al usuario.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_UserRole') ||
        msg.includes('UQ_UserRole') ||
        msg.includes('UNIQUE') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('duplicada') ||
        msg.toLowerCase().includes('duplicado')
      ) {
        const domainError = new DomainError(
          'El usuario ya tiene asignado ese rol.',
          `Violación de índice único al asignar rol. userId=${dto.userId}, roleId=${dto.roleId}. Detalle: ${msg}`,
          409,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al asignar rol a usuario. SP: usp_UserRole_Assign',
        error,
      );
    }
  }

  async removeRole(
    dto: RemoveUserRoleDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    try {
      if (!dto.userId || typeof dto.userId !== 'number') {
        throw new DomainError(
          'Debe especificarse el usuario al que se removerá el rol.',
          `RemoveUserRoleDto sin userId válido. userId=${dto.userId}`,
          400,
        );
      }

      if (!dto.roleId || typeof dto.roleId !== 'number') {
        throw new DomainError(
          'Debe especificarse el rol a remover.',
          `RemoveUserRoleDto sin roleId válido. roleId=${dto.roleId}`,
          400,
        );
      }

      await this.userRoleRepository.removeRole(
        dto.userId,
        dto.roleId,
        currentUserId,
      );

      return {
        message: 'Rol removido correctamente del usuario.',
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.toLowerCase().includes('no existe') ||
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('no asignado')
      ) {
        const domainError = new DomainError(
          'El rol no está asignado al usuario o ya fue removido.',
          `Intento de remover rol no asignado. userId=${dto.userId}, roleId=${dto.roleId}. Detalle: ${msg}`,
          404,
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al remover rol de usuario. SP: usp_UserRole_Remove',
        error,
      );
    }
  }

  async listRolesByUser(
    query: UserRoleQueryDto,
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    try {
      const userId = (query as any).userId;

      if (!userId || typeof userId !== 'number') {
        throw new DomainError(
          'Debe especificarse el identificador del usuario.',
          `UserRoleQueryDto sin userId válido. userId=${userId}`,
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

      const rows = await this.userRoleRepository.listByUser(userId);
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const items = rows
        .slice(start, end)
        .map((row) => this.mapDbUserRoleToResponse(row));

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
        'Error técnico al listar roles de usuario. SP: usp_UserRole_ListByUser',
        error,
      );
    }
  }

  private mapDbUserRoleToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.uro_id ?? row.id,
      userId: row.uro_user_id ?? row.userId,
      roleId: row.uro_role_id ?? row.roleId,
      isPrimary: row.uro_is_primary ?? row.isPrimary ?? false,
      createdAt: row.uro_created_at ?? row.createdAt,
      createdBy: row.uro_created_by ?? row.createdBy,
      updatedAt: row.uro_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.uro_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.uro_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.uro_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.uro_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${
      (error as Error)?.message ?? String(error)
    }`;

    this.logger.error(
      internalMessage,
      (error as Error)?.stack,
      UserRoleService.name,
    );

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500,
    );
  }

  async findOne(id: number) {
    try {
      return await this.userRoleRepository.findOne(id);
    } catch (error) {
      const internalMessage = `Error técnico al obtener la asignación de rol con id ${id}. Detalle: ${
        (error as Error)?.message ?? String(error)
      }`;
  
      this.logger.error(internalMessage, (error as Error)?.stack, UserRoleService.name);
  
      throw error;
    }
  }
  
  
}
