import { Router } from 'express';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { buildAuthRouter } from './auth.router';

export interface AuditLogModule {
  router: Router;
  service: AuthService;
}

export interface AuditLogModuleDeps {
  dataSource: DataSource;
}

export function buildAuthModule(deps: AuditLogModuleDeps): AuditLogModule {
  const { dataSource } = deps;

  const authService = new AuthService(dataSource);
  const router = buildAuthRouter(authService);

  return {
    router,
    service: authService,
  };
}
