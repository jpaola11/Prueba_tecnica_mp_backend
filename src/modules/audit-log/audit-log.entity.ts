import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  @Entity({ name: 'AuditLog' })
  export class AuditLog {
    @PrimaryGeneratedColumn({ name: 'log_id' })
    id: number;
  
    @Index()
    @Column({ name: 'log_table_name', type: 'nvarchar', length: 128 })
    tableName: string;
  
    @Index()
    @Column({ name: 'log_record_pk', type: 'nvarchar', length: 64 })
    recordPk: string;
  
    @Column({ name: 'log_operation', type: 'nvarchar', length: 20 })
    operation: string; // INSERT | UPDATE | SOFT_DELETE | RESTORE | LOGIN | ...
  
    @Column({ name: 'log_operation_at', type: 'datetime2' })
    operationAt: Date;
  
    @Column({ name: 'log_user_id', type: 'int', nullable: true })
    userId?: number;
  
    @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
    user?: User;
  
    @Column({ name: 'log_old_values', type: 'nvarchar', nullable: true })
    oldValues?: string; // JSON
  
    @Column({ name: 'log_new_values', type: 'nvarchar', nullable: true })
    newValues?: string; // JSON
  
    @Column({ name: 'log_source_ip', type: 'nvarchar', length: 50, nullable: true })
    sourceIp?: string;
  
    @Column({ name: 'log_user_agent', type: 'nvarchar', length: 500, nullable: true })
    userAgent?: string;
  
    @Index()
    @Column({ name: 'log_correlation_id', type: 'nvarchar', length: 100, nullable: true })
    correlationId?: string;
  }
  