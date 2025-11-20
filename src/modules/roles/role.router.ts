import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/role.update.dto';
import { RoleQueryDto } from './dto/query-role.dto';
import { RoleIdParamDto } from './dto/id-role.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildRoleRouter(roleService: RoleService): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(RoleQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as RoleQueryDto;
        const result = await roleService.listActiveRoles();
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateRoleDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateRoleDto;
        const currentUserId = req.user?.id ?? null;
        const created = await roleService.createRole(body, currentUserId!);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(RoleIdParamDto, 'params'),
    validateDto(UpdateRoleDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as RoleIdParamDto;
        const body = req.validatedBody as UpdateRoleDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await roleService.updateRole(params.id, body, currentUserId!);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(RoleIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as RoleIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await roleService.softDeleteRole(params.id, currentUserId!);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
