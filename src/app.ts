import express, { Application } from 'express';
import { DataSource } from 'typeorm';

import { buildAuditLogModule } from './modules/audit-log/audit-log.module';
import { buildUserModule } from './modules/users/user.module';
import { buildOrgUnitModule } from './modules/org-unit/org-unit.module';
import { buildRoleModule } from './modules/roles/role.module';
import { buildCaseStatusModule } from './modules/case-status/case-status.module';
import { buildCaseFileModule } from './modules/case-file/case-file.module';
import { buildEvidenceModule } from './modules/evidence/evidence.module';
import { buildCaseReviewModule } from './modules/case-review/case-review.module';
import { buildAuthModule } from './modules/auth/auth.module';

export function buildApp(dataSource: DataSource): Application {
  const app = express();
  app.use(express.json());

  const authModule = buildAuthModule({ dataSource });

  // 1) Módulo de auditoría (core dependency)
  const auditLogModule = buildAuditLogModule({ dataSource });

  // 2) Módulos de negocio
  const userModule = buildUserModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  const orgUnitModule = buildOrgUnitModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  const roleModule = buildRoleModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  const caseStatusModule = buildCaseStatusModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  const caseFileModule = buildCaseFileModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  const evidenceModule = buildEvidenceModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  const caseReviewModule = buildCaseReviewModule({
    dataSource,
    auditLogService: auditLogModule.service,
  });

  // 3) Montar routers
  app.use('/api/auth', authModule.router);
  app.use('/api/audit-logs', auditLogModule.router);
  app.use('/api/users', userModule.router);
  app.use('/api/org-units', orgUnitModule.router);
  app.use('/api/roles', roleModule.router);
  app.use('/api/case-statuses', caseStatusModule.router);
  app.use('/api/case-files', caseFileModule.router);
  app.use('/api/evidences', evidenceModule.router);
  app.use('/api/case-reviews', caseReviewModule.router);

  return app;
}
