import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    Index,
  } from 'typeorm';
  import { OrgUnit } from '../org-unit/org-unit.entity';
  import { UserRole } from '../roles/user-role.entity';
  import { CaseFile } from '../case-file/case-file.entity';
  import { Evidence } from '../evidence/evidence.entity';
  import { CaseReview } from '../case-review/case-review.entity';
  import { AuditLog } from '../audit-log/audit-log.entity';
  
  @Entity({ name: 'User' })
  export class User {
    @PrimaryGeneratedColumn({ name: 'usr_id' })
    id: number;
  
    @Index({ unique: true })
    @Column({ name: 'usr_username', type: 'nvarchar', length: 50 })
    username: string;
  
    @Column({ name: 'usr_password_hash', type: 'nvarchar', length: 200 })
    passwordHash: string;
  
    @Index({ unique: true })
    @Column({ name: 'usr_email', type: 'nvarchar', length: 200 })
    email: string;
  
    @Column({ name: 'usr_full_name', type: 'nvarchar', length: 200 })
    fullName: string;
  
    @Column({ name: 'usr_org_unit_id', type: 'int', nullable: true })
    orgUnitId: number | null;
  
    @ManyToOne(() => OrgUnit, (org) => org.users, { nullable: true })
    orgUnit: OrgUnit | null;
  
    @Column({ name: 'usr_is_active', type: 'bit', default: true })
    isActive: boolean;
  
    @Column({ name: 'usr_must_change_password', type: 'bit', default: false })
    mustChangePassword: boolean;
  
    @Column({ name: 'usr_last_login_at', type: 'datetime2', nullable: true })
    lastLoginAt?: Date;
  
    // Auditoría / soft delete
    @Column({ name: 'usr_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'usr_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'usr_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'usr_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'usr_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'usr_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'usr_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  
    // Relaciones
    @OneToMany(() => UserRole, (ur) => ur.user)
    userRoles: UserRole[];
  
    @OneToMany(() => CaseFile, (cas) => cas.technician)
    caseFilesAsTechnician: CaseFile[];
  
    @OneToMany(() => Evidence, (evd) => evd.technician)
    evidencesAsTechnician: Evidence[];
  
    @OneToMany(() => CaseReview, (crv) => crv.reviewer)
    caseReviewsAsReviewer: CaseReview[];
  
    @OneToMany(() => AuditLog, (log) => log.user)
    auditLogs: AuditLog[];
  }
  