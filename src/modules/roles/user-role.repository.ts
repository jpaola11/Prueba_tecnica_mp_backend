// src/modules/user-role/user-role.repository.ts
import { DataSource } from 'typeorm';

export class UserRoleRepository {
  constructor(private readonly dataSource: DataSource) {}

  async assignRole(
    userId: number,
    roleId: number,
    isPrimary: boolean,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_UserRole_Assign
        @uro_user_id   = @0,
        @uro_role_id   = @1,
        @uro_is_primary= @2,
        @uro_created_by= @3;
      `,
      [userId, roleId, isPrimary, currentUserId],
    );
  }

  async removeRole(
    userId: number,
    roleId: number,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_UserRole_Remove
        @uro_user_id   = @0,
        @uro_role_id   = @1,
        @uro_deleted_by= @2;
      `,
      [userId, roleId, currentUserId],
    );
  }

  async listByUser(userId: number): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_UserRole_ListByUser
        @uro_user_id = @0;
      `,
      [userId],
    );

    return Array.isArray(rows) ? rows : [];
  }

  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_UserRole_GetById
        @usr_role_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
  
}
