import { DataSource } from 'typeorm';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/org-unit.update.dto';

export class OrgUnitRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateOrgUnitDto, currentUserId: number): Promise<number> {
    const result = await this.dataSource.query(
      `
      DECLARE @org_id_out INT;

      EXEC dbo.usp_OrgUnit_Insert
        @org_parent_id   = @0,
        @org_code        = @1,
        @org_name        = @2,
        @org_description = @3,
        @org_is_active   = @4,
        @org_created_by  = @5,
        @org_id_out      = @org_id_out OUTPUT;

      SELECT @org_id_out AS org_id;
      `,
      [
        dto.parentId ?? null,
        dto.code,
        dto.name,
        dto.description ?? null,
        dto.isActive ?? true,
        currentUserId,
      ],
    );

    const row = Array.isArray(result) && result[0] ? result[0] : null;
    if (!row || row.org_id == null) {
      throw new Error(
        'La ejecución de usp_OrgUnit_Insert no devolvió org_id.',
      );
    }

    return Number(row.org_id);
  }

  async update(
    id: number,
    dto: UpdateOrgUnitDto,
    currentUserId: number,
  ): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_OrgUnit_Update
        @org_id          = @0,
        @org_parent_id   = @1,
        @org_code        = @2,
        @org_name        = @3,
        @org_description = @4,
        @org_is_active   = @5,
        @org_updated_by  = @6;
      `,
      [
        id,
        dto.parentId ?? null,
        dto.code,
        dto.name,
        dto.description ?? null,
        dto.isActive ?? true,
        currentUserId,
      ],
    );
  }

  async getById(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_OrgUnit_GetById
        @org_id = @0;
      `,
      [id],
    );

    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  async listActive(): Promise<any[]> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_OrgUnit_ListActive;
      `,
    );

    return Array.isArray(rows) ? rows : [];
  }

  async softDelete(id: number, currentUserId: number): Promise<void> {
    await this.dataSource.query(
      `
      EXEC dbo.usp_OrgUnit_SoftDelete
        @org_id       = @0,
        @org_deleted_by = @1;
      `,
      [id, currentUserId],
    );
  }

  async findOne(id: number): Promise<any | null> {
    const rows = await this.dataSource.query(
      `
      EXEC dbo.usp_OrgUnit_GetById
        @org_id = @0;
      `,
      [id]
    );
    return rows[0] ?? null;
  }
  
}
