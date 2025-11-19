import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Index,
  } from 'typeorm';
  import { CaseFile } from '../case-file/case-file.entity';
  import { CaseReview } from '../case-review/case-review.entity';
  
  @Entity({ name: 'CaseStatus' })
  export class CaseStatus {
    @PrimaryGeneratedColumn({ name: 'cst_id' })
    id: number;
  
    @Index({ unique: true })
    @Column({ name: 'cst_code', type: 'nvarchar', length: 50 })
    code: string;
  
    @Column({ name: 'cst_name', type: 'nvarchar', length: 100 })
    name: string;
  
    @Column({ name: 'cst_description', type: 'nvarchar', length: 500, nullable: true })
    description?: string;
  
    @Column({ name: 'cst_is_final', type: 'bit', default: false })
    isFinal: boolean;
  
    @Column({ name: 'cst_order', type: 'int' })
    order: number;
  
    // Auditoría / soft delete
    @Column({ name: 'cst_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'cst_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'cst_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'cst_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'cst_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'cst_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'cst_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  
    // Relaciones
    @OneToMany(() => CaseFile, (cas) => cas.status)
    caseFiles: CaseFile[];
  
    @OneToMany(() => CaseReview, (crv) => crv.previousStatus)
    reviewsAsPreviousStatus: CaseReview[];
  
    @OneToMany(() => CaseReview, (crv) => crv.newStatus)
    reviewsAsNewStatus: CaseReview[];
  }
  