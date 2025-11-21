import { Router } from 'express';
import { DataSource } from 'typeorm';
import { OrgUnitRepository } from './org-unit.repository';
import { OrgUnitService } from './org-unit.service';
import { buildOrgUnitRouter } from './org-unit.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface OrgUnitModule {
  router: Router;
  service: OrgUnitService;
}

export interface OrgUnitModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildOrgUnitModule(deps: OrgUnitModuleDeps): OrgUnitModule {
  const { dataSource, auditLogService } = deps;

  const orgUnitRepository = new OrgUnitRepository(dataSource);
  const orgUnitService = new OrgUnitService(orgUnitRepository,);
  const router = buildOrgUnitRouter(orgUnitService);

  return {
    router,
    service: orgUnitService,
  };
}
