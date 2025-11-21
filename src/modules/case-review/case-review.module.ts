import { Router } from 'express';
import { DataSource } from 'typeorm';
import { CaseReviewRepository } from './case-review.repository';
import { CaseReviewService } from './case-review.service';
import { buildCaseReviewRouter } from './case-review.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface CaseReviewModule {
  router: Router;
  service: CaseReviewService;
}

export interface CaseReviewModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildCaseReviewModule(
  deps: CaseReviewModuleDeps,
): CaseReviewModule {
  const { dataSource, auditLogService } = deps;

  const caseReviewRepository = new CaseReviewRepository(dataSource);
  const caseReviewService = new CaseReviewService(
    caseReviewRepository,
    auditLogService,
  );
  const router = buildCaseReviewRouter(caseReviewService);

  return {
    router,
    service: caseReviewService,
  };
}
