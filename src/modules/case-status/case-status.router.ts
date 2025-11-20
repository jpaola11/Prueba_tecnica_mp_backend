import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseStatusService } from './case-status.service';
import { CreateCaseStatusDto } from './dto/create-case-status.dto';
import { UpdateCaseStatusDto } from './dto/case-status.update.dto';
import { CaseStatusQueryDto } from './dto/query-case-status.dto';
import { CaseStatusIdParamDto } from './dto/id-case-status.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildCaseStatusRouter(
  caseStatusService: CaseStatusService,
): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(CaseStatusQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as CaseStatusQueryDto;
        const result = await caseStatusService.listActiveStatuses();
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseStatusDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateCaseStatusDto;
        const currentUserId = req.user?.id ?? null;
        const created = await caseStatusService.createStatus(body, currentUserId!);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseStatusIdParamDto, 'params'),
    validateDto(UpdateCaseStatusDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseStatusIdParamDto;
        const body = req.validatedBody as UpdateCaseStatusDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await caseStatusService.updateStatus(
          params.id,
          body,
          currentUserId!,
        );
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseStatusIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseStatusIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await caseStatusService.softDeleteStatus(params.id, currentUserId!);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
