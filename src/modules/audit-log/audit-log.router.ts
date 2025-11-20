import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { AuditLogService } from './audit-log.service';
import { AuditLogQueryDto } from './dto/query-audit-log.dto';
import { AuditLogIdParamDto } from './dto/id-audit-log.dto';

interface AuthRequest extends Request {
  id?: number;
  user?: {
    id: number;
    [key: string]: any;
  };
}

export function buildAuditLogRouter(auditLogService: AuditLogService): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(AuditLogQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const result = await auditLogService.findAll();
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(AuditLogIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const log = await auditLogService.findOne(req.id!);
        res.json(log);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
