import { Router } from 'express';
import { DataSource } from 'typeorm';
import { CaseFileRepository } from './case-file.repository';
import { CaseFileService } from './case-file.service';
import { buildCaseFileRouter } from './case-file.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface CaseFileModule {
  router: Router;
  service: CaseFileService;
}

export interface CaseFileModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildCaseFileModule(deps: CaseFileModuleDeps): CaseFileModule {
  const { dataSource, auditLogService } = deps;

  const caseFileRepository = new CaseFileRepository(dataSource);
  const caseFileService = new CaseFileService(
    caseFileRepository,
    auditLogService,
  );
  const router = buildCaseFileRouter(caseFileService);

  return {
    router,
    service: caseFileService,
  };
}
