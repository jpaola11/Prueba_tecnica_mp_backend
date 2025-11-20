import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { AuditLogService } from './audit-log.service';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { AuditLogIdParamDto } from './dto/audit-log-id-param.dto';

interface AuthRequest extends Request {
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
        const query = req.validatedQuery as AuditLogQueryDto;
        const result = await auditLogService.findAll(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(AuditLogIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as AuditLogIdParamDto;
        const log = await auditLogService.findOne(params.id);
        res.json(log);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
