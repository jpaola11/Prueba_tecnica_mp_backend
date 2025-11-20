import { Router } from 'express';
import { DataSource } from 'typeorm';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLogService } from './audit-log.service';
import { buildAuditLogRouter } from './audit-log.router';

export interface AuditLogModule {
  router: Router;
  service: AuditLogService;
}

export interface AuditLogModuleDeps {
  dataSource: DataSource;
}

export function buildAuditLogModule(deps: AuditLogModuleDeps): AuditLogModule {
  const { dataSource } = deps;

  const auditLogRepository = new AuditLogRepository(dataSource);
  const auditLogService = new AuditLogService(auditLogRepository);
  const router = buildAuditLogRouter(auditLogService);

  return {
    router,
    service: auditLogService,
  };
}
