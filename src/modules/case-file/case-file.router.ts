import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseFileService } from './case-file.service';
import { CreateCaseFileDto } from './dto/create-case-file.dto';
import { UpdateCaseFileDto } from './dto/case-file.upadate.dto';
import { CaseFileQueryDto } from './dto/query-case-file.dto';
import { CaseFileIdParamDto } from './dto/id-case-file.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildCaseFileRouter(
  caseFileService: CaseFileService,
): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(CaseFileQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as CaseFileQueryDto;
        const result = await caseFileService.listCases(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseFileIdParamDto;
        const item = await caseFileService.getCaseById(params.id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseFileDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateCaseFileDto;
        const currentUserId = req.user?.id ?? null;
        const created = await caseFileService.createCase(body, currentUserId!);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    validateDto(UpdateCaseFileDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseFileIdParamDto;
        const body = req.validatedBody as UpdateCaseFileDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await caseFileService.updateCase(
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

  router.patch(
    '/:id/status',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    validateDto(ChangeCaseStatusDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseFileIdParamDto;
        const body = req.validatedBody as ChangeCaseStatusDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await caseFileService.changeStatus(
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

  return router;
}
