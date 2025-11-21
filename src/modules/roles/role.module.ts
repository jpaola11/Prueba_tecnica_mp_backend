import { Router } from 'express';
import { DataSource } from 'typeorm';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';
import { buildRoleRouter } from './role.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface RoleModule {
  router: Router;
  service: RoleService;
}

export interface RoleModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildRoleModule(deps: RoleModuleDeps): RoleModule {
  const { dataSource, auditLogService } = deps;

  const roleRepository = new RoleRepository(dataSource);
  const roleService = new RoleService(roleRepository,);
  const router = buildRoleRouter(roleService);

  return {
    router,
    service: roleService,
  };
}
