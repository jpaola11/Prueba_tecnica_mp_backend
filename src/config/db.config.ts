import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Role } from '../modules/roles/role.entity';
import { User } from '../modules/users/user.entity';
import { UserRole } from '../modules/roles/user-role.entity';
import { OrgUnit } from '../modules/org-unit/org-unit.entity';
import { CaseStatus } from '../modules/case-status/case-status.entity';
import { CaseFile } from '../modules/case-file/case-file.entity';
import { CaseReview } from '../modules/case-review/case-review.entity';
import { Evidence } from '../modules/evidence/evidence.entity';
import { AuditLog } from '../modules/audit-log/audit-log.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  username: 'sa',
  password: 'Admin!123',
  database: process.env.DB_NAME || 'Pruebamp',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'false',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  entities: [Role, User, UserRole, OrgUnit, CaseStatus, CaseFile, CaseReview, Evidence, AuditLog],
});
