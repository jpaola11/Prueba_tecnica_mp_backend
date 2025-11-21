import { Router } from 'express';
import { DataSource } from 'typeorm';
import { ReportsService } from './reports.service';
import { buildReportsRouter } from './reports.router';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CaseFileRepository } from '../case-file/case-file.repository';

export interface ReportsModule {
  router: Router;
  service: ReportsService;
}

export interface ReportsModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildReportsModule(deps: ReportsModuleDeps): ReportsModule {
  const { dataSource, auditLogService } = deps;

  const caseFileRepository = new CaseFileRepository(dataSource);
  const roleService = new ReportsService(caseFileRepository);
  const router = buildReportsRouter(roleService);

  return {
    router,
    service: roleService,
  };
}
