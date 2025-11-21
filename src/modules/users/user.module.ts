import { Router } from 'express';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { buildUserRouter } from './user.router';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface UserModule {
  router: Router;
  service: UserService;
}

export interface UserModuleDeps {
  dataSource: DataSource;
  auditLogService: AuditLogService;
}

export function buildUserModule(deps: UserModuleDeps): UserModule {
  const { dataSource, auditLogService } = deps;

  const userRepository = new UserRepository(dataSource);
  const userService = new UserService(userRepository,);
  const router = buildUserRouter(userService);

  return {
    router,
    service: userService,
  };
}
