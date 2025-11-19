import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    Index,
  } from 'typeorm';
  import { OrgUnit } from '../org-unit/org-unit.entity';
  import { User } from '../users/user.entity';
  import { CaseStatus } from '../case-status/case-status.entity';
  import { Evidence } from '../evidence/evidence.entity';
  import { CaseReview } from '../case-review/case-review.entity';
  
  @Entity({ name: 'CaseFile' })
  export class CaseFile {
    @PrimaryGeneratedColumn({ name: 'cas_id' })
    id: number;
  
    @Index({ unique: true })
    @Column({ name: 'cas_code', type: 'nvarchar', length: 100 })
    code: string;
  
    @Column({ name: 'cas_title', type: 'nvarchar', length: 200 })
    title: string;
  
    @Column({ name: 'cas_description', type: 'nvarchar', length: 1000, nullable: true })
    description?: string;
  
    @Column({ name: 'cas_org_unit_id', type: 'int', nullable: true })
    orgUnitId: number | null;
  
    @ManyToOne(() => OrgUnit, (org) => org.caseFiles, { nullable: true })
    orgUnit: OrgUnit | null;
  
    @Column({ name: 'cas_technician_id', type: 'int' })
    technicianId: number;
  
    @ManyToOne(() => User, (user) => user.caseFilesAsTechnician)
    technician: User;
  
    @Column({ name: 'cas_status_id', type: 'int' })
    statusId: number;
  
    @ManyToOne(() => CaseStatus, (status) => status.caseFiles)
    status: CaseStatus;
  
    @Column({ name: 'cas_open_date', type: 'datetime2' })
    openDate: Date;
  
    @Column({ name: 'cas_close_date', type: 'datetime2', nullable: true })
    closeDate?: Date;
  
    @Column({ name: 'cas_reference_external', type: 'nvarchar', length: 200, nullable: true })
    referenceExternal?: string;
  
    // Auditoría / soft delete
    @Column({ name: 'cas_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'cas_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'cas_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'cas_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'cas_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'cas_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'cas_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  
    // Relaciones
    @OneToMany(() => Evidence, (evd) => evd.caseFile)
    evidences: Evidence[];
  
    @OneToMany(() => CaseReview, (crv) => crv.caseFile)
    reviews: CaseReview[];
  }
  