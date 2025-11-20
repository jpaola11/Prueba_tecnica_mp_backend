// src/modules/user/user.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserQueryDto } from './dto/query-user.dto';
import { UserIdParamDto } from './dto/id-user.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildUserRouter(userService: UserService): Router {
  const router = Router();

  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Listar usuarios
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lista paginada de usuarios
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(UserQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as UserQueryDto;
        const result = await userService.listUsers(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     summary: Obtener usuario por ID
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *       404:
   *         description: Usuario no encontrado
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as UserIdParamDto;
        const user = await userService.getUserById(params.id);
        res.json(user);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Crear usuario
   *     tags:
   *       - Usuarios
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: Usuario creado
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateUserDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const body = req.body as CreateUserDto;
        const currentUserId = req.user?.id ?? null;
        const created = await userService.createUser(body, currentUserId!);
        res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users/{id}:
   *   put:
   *     summary: Actualizar usuario
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserDto'
   *     responses:
   *       200:
   *         description: Usuario actualizado
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    validateDto(UpdateUserDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as UserIdParamDto;
        const body = req.body as UpdateUserDto;
        const currentUserId = req.user?.id ?? null;
        const updated = await userService.updateUser(params.id, body, currentUserId!);
        res.json(updated);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     summary: Eliminar usuario (soft delete)
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Usuario eliminado
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as UserIdParamDto;
        const currentUserId = req.user?.id ?? null;
        await userService.softDeleteUser(params.id, currentUserId!);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
