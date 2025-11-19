import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Index,
  } from 'typeorm';
  import { UserRole } from '../roles/user-role.entity';
  
  @Entity({ name: 'Role' })
  export class Role {
    @PrimaryGeneratedColumn({ name: 'rol_id' })
    id: number;
  
    @Index({ unique: true })
    @Column({ name: 'rol_code', type: 'nvarchar', length: 50 })
    code: string;
  
    @Column({ name: 'rol_name', type: 'nvarchar', length: 100 })
    name: string;
  
    @Column({ name: 'rol_description', type: 'nvarchar', length: 500, nullable: true })
    description?: string;
  
    @Column({ name: 'rol_is_default', type: 'bit', default: false })
    isDefault: boolean;
  
    // Auditoría / soft delete
    @Column({ name: 'rol_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'rol_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'rol_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'rol_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'rol_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'rol_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'rol_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  
    @OneToMany(() => UserRole, (ur) => ur.role)
    userRoles: UserRole[];
  }
  