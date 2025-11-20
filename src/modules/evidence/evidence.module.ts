import { Router } from 'express';
import { DataSource } from 'typeorm';
import { EvidenceRepository } from './evidence.repository';
import { EvidenceService } from './evidence.service';
import { buildEvidenceRouter } from './evidence.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface EvidenceModule {
  router: Router;
  service: EvidenceService;
}

export interface EvidenceModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildEvidenceModule(
  deps: EvidenceModuleDeps,
): EvidenceModule {
  const { dataSource, auditLogService } = deps;

  const evidenceRepository = new EvidenceRepository(dataSource);
  const evidenceService = new EvidenceService(
    evidenceRepository,
    auditLogService,
  );
  const router = buildEvidenceRouter(evidenceService);

  return {
    router,
    service: evidenceService,
  };
}
