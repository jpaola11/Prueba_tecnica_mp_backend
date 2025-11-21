import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

@Entity({ name: 'UserRole' })
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {
  @PrimaryGeneratedColumn({ name: 'uro_id' })
  id: number;

  @Column({ name: 'uro_user_id', type: 'int' })
  userId: number;

  @Column({ name: 'uro_role_id', type: 'int' })
  roleId: number;

  @Column({ name: 'uro_is_primary', type: 'bit', default: false })
  isPrimary: boolean;

  @Column({ name: 'uro_created_at', type: 'datetime2' })
  createdAt: Date;

  @Column({ name: 'uro_created_by', type: 'int' })
  createdBy: number;

  @Column({ name: 'uro_updated_at', type: 'datetime2', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'uro_updated_by', type: 'int', nullable: true })
  updatedBy?: number;

  @Column({ name: 'uro_is_deleted', type: 'bit', default: false })
  isDeleted: boolean;

  @Column({ name: 'uro_deleted_at', type: 'datetime2', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'uro_deleted_by', type: 'int', nullable: true })
  deletedBy?: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'uro_user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'uro_role_id' })
  role: Role;
}
