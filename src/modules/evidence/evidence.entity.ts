import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
  } from 'typeorm';
  import { CaseFile } from '../case-file/case-file.entity';
  import { User } from '../users/user.entity';
  
  @Entity({ name: 'Evidence' })
  export class Evidence {
    @PrimaryGeneratedColumn({ name: 'evd_id' })
    id: number;
  
    @Column({ name: 'evd_case_id', type: 'int' })
    caseId: number;
  
    @ManyToOne(() => CaseFile, (cas) => cas.evidences)
    caseFile: CaseFile;
  
    @Index()
    @Column({ name: 'evd_seq_number', type: 'int' })
    seqNumber: number;
  
    @Column({ name: 'evd_description', type: 'nvarchar', length: 1000 })
    description: string;
  
    @Column({ name: 'evd_color', type: 'nvarchar', length: 100, nullable: true })
    color?: string;
  
    @Column({ name: 'evd_size_text', type: 'nvarchar', length: 200, nullable: true })
    sizeText?: string;
  
    @Column({
      name: 'evd_weight_value',
      type: 'decimal',
      precision: 18,
      scale: 2,
      nullable: true,
    })
    weightValue?: string;
  
    @Column({ name: 'evd_weight_unit', type: 'nvarchar', length: 20, nullable: true })
    weightUnit?: string;
  
    @Column({ name: 'evd_location', type: 'nvarchar', length: 300, nullable: true })
    location?: string;
  
    @Column({ name: 'evd_technician_id', type: 'int' })
    technicianId: number;
  
    @ManyToOne(() => User, (user) => user.evidencesAsTechnician)
    technician: User;
  
    @Column({ name: 'evd_observations', type: 'nvarchar', length: 1000, nullable: true })
    observations?: string;
  
    // Auditoría / soft delete
    @Column({ name: 'evd_created_at', type: 'datetime2' })
    createdAt: Date;
  
    @Column({ name: 'evd_created_by', type: 'int' })
    createdBy: number;
  
    @Column({ name: 'evd_updated_at', type: 'datetime2', nullable: true })
    updatedAt?: Date;
  
    @Column({ name: 'evd_updated_by', type: 'int', nullable: true })
    updatedBy?: number;
  
    @Column({ name: 'evd_is_deleted', type: 'bit', default: false })
    isDeleted: boolean;
  
    @Column({ name: 'evd_deleted_at', type: 'datetime2', nullable: true })
    deletedAt?: Date;
  
    @Column({ name: 'evd_deleted_by', type: 'int', nullable: true })
    deletedBy?: number;
  }
  