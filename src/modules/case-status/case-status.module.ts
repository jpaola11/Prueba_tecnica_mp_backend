import { Router } from 'express';
import { DataSource } from 'typeorm';
import { CaseStatusRepository } from './case-status.repository';
import { CaseStatusService } from './case-status.service';
import { buildCaseStatusRouter } from './case-status.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface CaseStatusModule {
  router: Router;
  service: CaseStatusService;
}

export interface CaseStatusModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildCaseStatusModule(
  deps: CaseStatusModuleDeps,
): CaseStatusModule {
  const { dataSource, auditLogService } = deps;

  const caseStatusRepository = new CaseStatusRepository(dataSource);
  const caseStatusService = new CaseStatusService(
    caseStatusRepository,
  );
  const router = buildCaseStatusRouter(caseStatusService);

  return {
    router,
    service: caseStatusService,
  };
}
