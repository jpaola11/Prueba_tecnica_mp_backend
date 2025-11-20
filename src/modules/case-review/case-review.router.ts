import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseReviewService } from './case-review.service';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';
import { UpdateCaseReviewDto } from './dto/case-review.update.dto';
import { CaseReviewQueryDto } from './dto/query-case-rewiew.dto';
import { CaseReviewIdParamDto } from './dto/case-review-id-param.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildCaseReviewRouter(
  caseReviewService: CaseReviewService,
): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(CaseReviewQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as CaseReviewQueryDto;
        const result = await caseReviewService.findAll(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseReviewIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseReviewIdParamDto;
        const item = await caseReviewService.findOne(params.id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseReviewDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateCaseReviewDto;
        const currentUserId = req.user?.id ?? null;
        const created = await caseReviewService.create(body, currentUserId);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseReviewIdParamDto, 'params'),
    validateDto(UpdateCaseReviewDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseReviewIdParamDto;
        const body = req.validatedBody as UpdateCaseReviewDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await caseReviewService.update(
          params.id,
          body,
          currentUserId,
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
    validateDto(CaseReviewIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as CaseReviewIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await caseReviewService.remove(params.id, currentUserId);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
