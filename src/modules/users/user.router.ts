// src/modules/user/user.router.ts
import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserQueryDto } from './dto/query-user.dto';
import { UserIdParamDto } from './dto/id-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

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
 * /users/seed:
 *   post:
 *     summary: Crear un nuevo usuario (sin autenticación)
 *     description: Endpoint público para crear un usuario sin requerir JWT.
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
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponseDto'
 *       400:
 *         description: Solicitud inválida o error de validación.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericMessageResponseDto'
 *       409:
 *         description: Ya existe un usuario con ese username o email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericMessageResponseDto'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericMessageResponseDto'
 */
router.post(
  '/seed/',
  validateDto(CreateUserDto, 'body'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as CreateUserDto;

      // Como no hay JWT, no hay usuario autenticado.
      const currentUserId = 0;

      const result = await userService.createUser(dto, currentUserId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);


  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Crear un nuevo usuario
   *     description: Crea un nuevo usuario en el sistema utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Usuarios
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: Usuario creado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateUserResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe un usuario con el mismo nombre de usuario o correo electrónico.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar crear el usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateUserDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateUserDto;
        const currentUserId = Number(req.user?.id);
        const result = await userService.createUser(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Listar usuarios
   *     description: Devuelve un listado paginado de usuarios según los filtros y parámetros de búsqueda proporcionados.
   *     tags:
   *       - Usuarios
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         description: Número de página (1-based).
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         description: Cantidad de registros por página.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Listado de usuarios obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedUserResponseDto'
   *       400:
   *         description: Parámetros de consulta inválidos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar los usuarios.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
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
   *     summary: Obtener detalle de un usuario
   *     description: Obtiene la información detallada de un usuario específico a partir de su identificador.
   *     tags:
   *       - Usuarios
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del usuario.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *       404:
   *         description: El usuario solicitado no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar obtener el usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as UserIdParamDto;
        const result = await userService.getUserById(params.id);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users/{id}:
   *   put:
   *     summary: Actualizar un usuario
   *     description: Actualiza los datos de un usuario existente utilizando la información proporcionada en la solicitud.
   *     tags:
   *       - Usuarios
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del usuario.
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
   *         description: Usuario actualizado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Datos de actualización inválidos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El usuario a actualizar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Conflicto por nombre de usuario o correo duplicado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar actualizar el usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    validateDto(UpdateUserDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as UserIdParamDto;
        const dto = req.body as UpdateUserDto;
        const currentUserId = Number(req.user?.id);
        const result = await userService.updateUser(params.id, dto, currentUserId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     summary: Eliminar lógicamente un usuario
   *     description: Realiza el borrado lógico de un usuario, marcándolo como eliminado sin removerlo físicamente de la base de datos.
   *     tags:
   *       - Usuarios
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del usuario.
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario eliminado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El usuario no existe o ya fue eliminado previamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar eliminar el usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(UserIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as UserIdParamDto;
        const currentUserId = Number(req.user?.id);
        const result = await userService.softDeleteUser(params.id, currentUserId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
