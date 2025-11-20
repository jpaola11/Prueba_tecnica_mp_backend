import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserQueryDto } from './dto/query-user.dto';
import { UserIdParamDto } from './dto/user-id-param.dto';

interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export function buildUserRouter(userService: UserService): Router {
  const router = Router();

  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(UserQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.validatedQuery as UserQueryDto;
        const result = await userService.findAll(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as UserIdParamDto;
        const user = await userService.findOne(params.id);
        res.json(user);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateUserDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.validatedBody as CreateUserDto;
        const currentUserId = req.user?.id ?? null;
        const created = await userService.create(body, currentUserId);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    validateDto(UpdateUserDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as UserIdParamDto;
        const body = req.validatedBody as UpdateUserDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await userService.update(params.id, body, currentUserId);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.validatedParams as UserIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await userService.remove(params.id, currentUserId);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
