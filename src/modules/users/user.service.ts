// src/modules/user/user.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserQueryDto } from './dto/query-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

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
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    dto: CreateUserDto,
    currentUserId: number
  ): Promise<{ message: string; userId: number }> {
    try {
      const userId = await this.userRepository.create(dto, currentUserId);

      return {
        message: 'Usuario creado correctamente.',
        userId,
      };
    } catch (error) {
      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_User_Username') ||
        msg.includes('IX_User_Email') ||
        msg.includes('usr_username') ||
        msg.includes('usr_email') ||
        msg.includes('UNIQUE') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('duplicada') ||
        msg.toLowerCase().includes('duplicado')
      ) {
        const domainError = new DomainError(
          'Ya existe un usuario con ese nombre de usuario o correo electrónico.',
          `Violación de índice único al crear usuario. username=${dto.username}, email=${dto.email}. Detalle: ${msg}`,
          409
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError('Error técnico al crear usuario. SP: usp_User_Insert', error);
    }
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
    currentUserId: number
  ): Promise<{ message: string; user: any }> {
    try {
      const existing = await this.ensureUserExists(id);

      if (existing.usr_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'El usuario fue eliminado y no puede modificarse.',
          `Intento de actualizar usuario eliminado. usr_id=${id}`,
          409
        );
      }

      await this.userRepository.update(id, dto, currentUserId);

      const updated = await this.userRepository.getById(id);
      const userResponse = this.mapDbUserToResponse(updated ?? existing);

      return {
        message: 'Usuario actualizado correctamente.',
        user: userResponse,
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (
        msg.includes('IX_User_Username') ||
        msg.includes('IX_User_Email') ||
        msg.includes('usr_username') ||
        msg.includes('usr_email') ||
        msg.includes('UNIQUE') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('duplicada') ||
        msg.toLowerCase().includes('duplicado')
      ) {
        const domainError = new DomainError(
          'Ya existe un usuario con ese nombre de usuario o correo electrónico.',
          `Violación de índice único al actualizar usuario. usr_id=${id}, username=${dto.username}, email=${dto.email}. Detalle: ${msg}`,
          409
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError('Error técnico al actualizar usuario. SP: usp_User_Update', error);
    }
  }

  async updateUserPassword(
    id: number,
    dto: UpdateUserPasswordDto,
    currentUserId: number
  ): Promise<{ message: string }> {
    try {
      if (dto.newPassword !== dto.confirmPassword) {
        const domainError = new DomainError(
          'La confirmación de la nueva contraseña no coincide.',
          `Intento de actualizar contraseña con confirmación inválida. usr_id=${id}`,
          400
        );
        this.logger.warn(domainError.internalMessage);
        throw domainError;
      }

      await this.ensureUserExists(id);

      const isCurrentValid = await this.userRepository.verifyUserPassword(id, dto.currentPassword);

      if (!isCurrentValid) {
        const domainError = new DomainError(
          'La contraseña actual no es correcta.',
          `Contraseña actual inválida en actualización de usuario. usr_id=${id}`,
          400
        );
        this.logger.warn(domainError.internalMessage);
        throw domainError;
      }

      await this.userRepository.updatePassword(id, dto.newPassword, currentUserId);

      return {
        message: 'Contraseña actualizada correctamente.',
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe') || msg.toLowerCase().includes('not found')) {
        const domainError = new DomainError(
          'El usuario no existe.',
          `Intento de actualizar contraseña de usuario inexistente. usr_id=${id}. Detalle: ${msg}`,
          404
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al actualizar contraseña de usuario. SP: usp_User_UpdatePassword',
        error
      );
    }
  }

  async getUserById(id: number): Promise<any> {
    try {
      const row = await this.ensureUserExists(id);
      return this.mapDbUserToResponse(row);
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      this.handleUnexpectedError('Error técnico al obtener usuario. SP: usp_User_GetById', error);
    }
  }

  async listUsers(
    query: UserQueryDto
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    try {
      const page =
        typeof (query as any).page === 'number' && (query as any).page > 0
          ? (query as any).page
          : 1;

      const limit =
        typeof (query as any).limit === 'number' && (query as any).limit > 0
          ? (query as any).limit
          : 20;

      const rows = await this.userRepository.list(query);
      const total = rows.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const items = rows.slice(start, end).map((row) => this.mapDbUserToResponse(row));

      return {
        items,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.handleUnexpectedError('Error técnico al listar usuarios. SP: usp_User_List', error);
    }
  }

  async softDeleteUser(id: number, currentUserId: number): Promise<{ message: string }> {
    try {
      const existing = await this.ensureUserExists(id);

      if (existing.usr_is_deleted === true || existing.isDeleted === true) {
        throw new DomainError(
          'El usuario ya se encuentra eliminado.',
          `Soft delete repetido sobre usuario. usr_id=${id}`,
          409
        );
      }

      await this.userRepository.softDelete(id, currentUserId);

      return {
        message: 'Usuario eliminado correctamente.',
      };
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error(error.internalMessage, (error as Error).stack);
        throw error;
      }

      const err = error as any;
      const msg = typeof err?.message === 'string' ? err.message : '';

      if (msg.toLowerCase().includes('no existe') || msg.toLowerCase().includes('not found')) {
        const domainError = new DomainError(
          'El usuario no existe o ya fue eliminado.',
          `Intento de eliminar usuario inexistente. usr_id=${id}. Detalle: ${msg}`,
          404
        );
        this.logger.error(domainError.internalMessage, (error as Error)?.stack);
        throw domainError;
      }

      this.handleUnexpectedError(
        'Error técnico al eliminar usuario. SP: usp_User_SoftDelete',
        error
      );
    }
  }

  private async ensureUserExists(id: number): Promise<any> {
    const row = await this.userRepository.getById(id);

    if (!row) {
      throw new DomainError('El usuario no existe.', `User no encontrado para id=${id}`, 404);
    }

    return row;
  }

  private mapDbUserToResponse(row: any): any {
    if (!row) {
      return null;
    }

    return {
      id: row.usr_id ?? row.id,
      username: row.usr_username ?? row.username,
      email: row.usr_email ?? row.email,
      fullName: row.usr_full_name ?? row.fullName,
      orgUnitId: row.usr_org_unit_id ?? row.orgUnitId ?? null,
      isActive: row.usr_is_active ?? row.isActive ?? true,
      mustChangePassword: row.usr_must_change_password ?? row.mustChangePassword ?? false,
      lastLoginAt: row.usr_last_login_at ?? row.lastLoginAt ?? null,
      createdAt: row.usr_created_at ?? row.createdAt,
      createdBy: row.usr_created_by ?? row.createdBy,
      updatedAt: row.usr_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.usr_updated_by ?? row.updatedBy ?? null,
      isDeleted: row.usr_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.usr_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.usr_deleted_by ?? row.deletedBy ?? null,
    };
  }

  private handleUnexpectedError(action: string, error: unknown): never {
    const internalMessage = `${action}. Detalle: ${(error as Error)?.message ?? String(error)}`;

    this.logger.error(internalMessage, (error as Error)?.stack, UserService.name);

    throw new DomainError(
      'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
      internalMessage,
      500
    );
  }
}
