import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { CaseFile } from '../case-file/case-file.entity';
  
  @Entity({ name: 'OrgUnit' })
  export class OrgUnit {
    @PrimaryGeneratedColumn({ name: 'org_id' })
    id!: number;
  
    @ManyToOne(() => OrgUnit, (org) => org.children, { nullable: true })
    @Column({ name: 'org_parent_id', type: 'int', nullable: true })
    parentId: number | null;
  
    @OneToMany(() => OrgUnit, (org) => org.parent)
    children: OrgUnit[];
  
    @Column({ name: 'org_code', type: 'nvarchar', length: 50, unique: true })
    code: string;
  
    @Column({ name: 'org_name', type: 'nvarchar', length: 200 })
    name: string;
  
    @Column({ name: 'org_description', type: 'nvarchar', length: 500, nullable: true })
    description?: string;
  
    @Column({ name: 'org_is_active', type: 'bit', default: true })
    isActive: boolean;
  
    // Auditoría / soft delete
    @Column({ name: 'org_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'org_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'org_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'org_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'org_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'org_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'org_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  
    // Relaciones inversas
    @OneToMany(() => User, (user) => user.orgUnit)
    users: User[];
  
    @OneToMany(() => CaseFile, (cas) => cas.orgUnit)
    caseFiles: CaseFile[];
  
    @ManyToOne(() => OrgUnit, (org) => org.children, { nullable: true })
    parent: OrgUnit | null;
  }
  