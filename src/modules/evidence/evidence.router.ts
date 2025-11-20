import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/evidence.update.dto';
import { EvidenceQueryDto } from './dto/query-evidence.dto';
import { EvidenceIdParamDto } from './dto/id-evidence.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildEvidenceRouter(evidenceService: EvidenceService): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(EvidenceQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as EvidenceQueryDto;
        const result = await evidenceService.listEvidencesByCase(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateEvidenceDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateEvidenceDto;
        const currentUserId = req.user?.id ?? null;
        const created = await evidenceService.addEvidence(body, currentUserId!);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(EvidenceIdParamDto, 'params'),
    validateDto(UpdateEvidenceDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as EvidenceIdParamDto;
        const body = req.validatedBody as UpdateEvidenceDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await evidenceService.updateEvidence(params.id, body, currentUserId!);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(EvidenceIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as EvidenceIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await evidenceService.softDeleteEvidence(params.id, currentUserId!);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
