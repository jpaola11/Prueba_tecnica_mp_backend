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
  app.use('/auth', authModule.router);
  app.use('/audit-logs', auditLogModule.router);
  app.use('/users', userModule.router);
  app.use('/org-units', orgUnitModule.router);
  app.use('/roles', roleModule.router);
  app.use('/case-statuses', caseStatusModule.router);
  app.use('/case-files', caseFileModule.router);
  app.use('/evidences', evidenceModule.router);
  app.use('/case-reviews', caseReviewModule.router);

  return app;
}
