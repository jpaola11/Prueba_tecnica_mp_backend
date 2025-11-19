// src/modules/user/user.repository.ts
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserQueryDto } from './dto/query-user.dto';

export class UserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateUserDto, currentUserId: number): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @usr_id_out INT;

      EXEC dbo.usp_User_Insert
        @usr_username             = @0,
        @usr_password_hash        = @1,
        @usr_email                = @2,
        @usr_full_name            = @3,
        @usr_org_unit_id          = @4,
        @usr_is_active            = @5,
        @usr_must_change_password = @6,
        @usr_created_by           = @7,
        @usr_id_out               = @usr_id_out OUTPUT;

      SELECT @usr_id_out AS usr_id;
      `,
      [
        dto.username,
        dto.passwordHash,
        dto.email,
        dto.fullName,
        dto.orgUnitId ?? null,
        dto.isActive ?? true,
        dto.mustChangePassword ?? false,
        currentUserId,
      ],
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.usr_id == null) {
      throw new Error('La ejecución de usp_User_Insert no devolvió usr_id.');
    }

    return Number(row.usr_id);
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_User_Update
        @usr_id                  = @0,
        @usr_username            = @1,
        @usr_email               = @2,
        @usr_full_name           = @3,
        @usr_org_unit_id         = @4,
        @usr_is_active           = @5,
        @usr_must_change_password= @6,
        @usr_updated_by          = @7;
      `,
      [
        id,
        dto.username,
        dto.email,
        dto.fullName,
        dto.orgUnitId ?? null,
        dto.isActive ?? true,
        dto.mustChangePassword ?? false,
        currentUserId,
      ],
    );
  }

  async updatePassword(
    id: number,
    passwordHash: string,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_User_UpdatePassword
        @usr_id            = @0,
        @usr_password_hash = @1,
        @usr_updated_by    = @2;
      `,
      [id, passwordHash, currentUserId],
    );
  }

  async getById(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_User_GetById
        @usr_id = @0;
      `,
      [id],
    );

    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async list(query: UserQueryDto): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_User_List
        @org_unit_id = @0,
        @only_active = @1;
      `,
      [query.orgUnitId ?? null, query.onlyActive ?? true],
    );

    return Array.isArray(rows) ? rows : [];
  }

  async softDelete(id: number, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_User_SoftDelete
        @usr_id        = @0,
        @usr_deleted_by = @1;
      `,
      [id, currentUserId],
    );
  }
}
