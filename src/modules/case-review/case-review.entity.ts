import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { CaseFile } from '../case-file/case-file.entity';
  import { User } from '../users/user.entity';
  import { CaseStatus } from '../case-status/case-status.entity';
  
  @Entity({ name: 'CaseReview' })
  export class CaseReview {
    @PrimaryGeneratedColumn({ name: 'crv_id' })
    id: number;
  
    @Column({ name: 'crv_case_id', type: 'int' })
    caseId: number;
  
    @ManyToOne(() => CaseFile, (cas) => cas.reviews)
    caseFile: CaseFile;
  
    @Column({ name: 'crv_reviewer_id', type: 'int' })
    reviewerId: number;
  
    @ManyToOne(() => User, (user) => user.caseReviewsAsReviewer)
    reviewer: User;
  
    @Column({ name: 'crv_previous_status_id', type: 'int' })
    previousStatusId: number;
  
    @ManyToOne(() => CaseStatus, (status) => status.reviewsAsPreviousStatus)
    previousStatus: CaseStatus;
  
    @Column({ name: 'crv_new_status_id', type: 'int' })
    newStatusId: number;
  
    @ManyToOne(() => CaseStatus, (status) => status.reviewsAsNewStatus)
    newStatus: CaseStatus;
  
    @Column({ name: 'crv_comment', type: 'nvarchar', length: 1000, nullable: true })
    comment?: string;
  
    @Column({ name: 'crv_reviewed_at', type: 'datetime2' })
    reviewedAt: Date;
  
    // Auditoría / soft delete
    @Column({ name: 'crv_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'crv_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'crv_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'crv_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'crv_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'crv_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'crv_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  }
  