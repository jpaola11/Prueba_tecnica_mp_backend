import { DataSource } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/role.update.dto';

export class RoleRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateRoleDto, currentUserId: number): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @rol_id_out INT;

      EXEC dbo.usp_Role_Insert
        @rol_code        = @0,
        @rol_name        = @1,
        @rol_description = @2,
        @rol_is_default  = @3,
        @rol_created_by  = @4,
        @rol_id_out      = @rol_id_out OUTPUT;

      SELECT @rol_id_out AS rol_id;
      `,
      [dto.code, dto.name, dto.description ?? null, dto.isDefault ?? false, currentUserId]
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.rol_id == null) {
      throw new Error('La ejecución de usp_Role_Insert no devolvió rol_id.');
    }

    return Number(row.rol_id);
  }

  async update(id: number, dto: UpdateRoleDto, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_Role_Update
        @rol_id         = @0,
        @rol_code       = @1,
        @rol_name       = @2,
        @rol_description= @3,
        @rol_is_default = @4,
        @rol_updated_by = @5;
      `,
      [id, dto.code, dto.name, dto.description ?? null, dto.isDefault ?? false, currentUserId]
    );
  }

  async listActive(): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_Role_ListActive;
      `
    );

    return Array.isArray(rows) ? rows : [];
  }

  async softDelete(id: number, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_Role_SoftDelete
        @rol_id        = @0,
        @rol_deleted_by = @1;
      `,
      [id, currentUserId]
    );
  }

  async findById(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_Role_FindById
        @rol_id = @0
    `,
      [id]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_Role_GetById
        @role_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
  
}
