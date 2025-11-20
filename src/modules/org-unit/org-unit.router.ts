import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { OrgUnitService } from './org-unit.service';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/org-unit.update.dto';
import { OrgUnitQueryDto } from './dto/query-unit.dto';
import { OrgUnitIdParamDto } from './dto/org-unit-id-param.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildOrgUnitRouter(orgUnitService: OrgUnitService): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(OrgUnitQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as OrgUnitQueryDto;
        const result = await orgUnitService.findAll(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(OrgUnitIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as OrgUnitIdParamDto;
        const item = await orgUnitService.findOne(params.id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateOrgUnitDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateOrgUnitDto;
        const currentUserId = req.user?.id ?? null;
        const created = await orgUnitService.create(body, currentUserId);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(OrgUnitIdParamDto, 'params'),
    validateDto(UpdateOrgUnitDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as OrgUnitIdParamDto;
        const body = req.validatedBody as UpdateOrgUnitDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await orgUnitService.update(
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
    validateDto(OrgUnitIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as OrgUnitIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await orgUnitService.remove(params.id, currentUserId);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
