// Router

import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/role.update.dto';
import { RoleQueryDto } from './dto/query-role.dto';
import { RoleIdParamDto } from './dto/id-role.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}
/**
 * Construye el router de Roles.
 */
export function buildRoleRouter(roleService: RoleService): Router {
  const router = Router();

  /**
   * @openapi
   * /roles:
   *   get:
   *     summary: Listar roles activos
   *     description: Devuelve el catálogo de roles activos registrados en el sistema.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listado de roles activos obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ListRoleResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar los roles.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(RoleQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const result = await roleService.listActiveRoles();
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /roles:
   *   post:
   *     summary: Crear un nuevo rol
   *     description: Crea un nuevo rol en el sistema utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRoleDto'
   *     responses:
   *       201:
   *         description: Rol creado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateRoleResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos del rol.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe un rol con el mismo código (violación de índice único).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar crear el rol.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateRoleDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateRoleDto;
        const currentUserId = Number(req.user?.id);
        const result = await roleService.createRole(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /roles/{id}:
   *   put:
   *     summary: Actualizar un rol
   *     description: Actualiza los datos de un rol existente identificado por su identificador numérico.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del rol.
   *         schema:
   *           type: integer
   *           format: int32
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRoleDto'
   *     responses:
   *       200:
   *         description: Rol actualizado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos de actualización.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El rol a actualizar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe un rol con el mismo código (violación de índice único).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar actualizar el rol.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(RoleIdParamDto, 'params'),
    validateDto(UpdateRoleDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as RoleIdParamDto;
        const dto = req.body as UpdateRoleDto;
        const currentUserId = Number(req.user?.id);
        const result = await roleService.updateRole(params.id, dto, currentUserId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /roles/{id}:
   *   delete:
   *     summary: Eliminar lógicamente un rol
   *     description: Realiza el borrado lógico de un rol, marcándolo como eliminado sin removerlo físicamente de la base de datos.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del rol.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Rol eliminado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El rol no existe o ya fue eliminado previamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar eliminar el rol.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(RoleIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as RoleIdParamDto;
        const currentUserId = Number(req.user?.id);
        const result = await roleService.softDeleteRole(params.id, currentUserId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /roles/{id}:
   *   get:
   *     summary: Obtener detalle de un rol por su identificador
   *     description: Devuelve la información detallada de un rol activo, buscado por su ID.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del rol
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Rol encontrado y devuelto correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleResponseDto'
   *       404:
   *         description: No se encontró un rol con el ID especificado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar obtener el rol.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(RoleIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const result = await roleService.getRoleById(id);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;

  /**
 * @openapi
 * /roles/{id}:
 *   get:
 *     summary: Obtener detalle de un rol
 *     description: Devuelve la información del rol solicitado.
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del rol.
 *     responses:
 *       200:
 *         description: Rol obtenido correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       404:
 *         description: Rol no encontrado.
 *       500:
 *         description: Error interno.
 */
router.get(
  '/:id',
  jwtAuthMiddleware,
  validateDto(RoleIdParamDto, 'params'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const params = req.params as unknown as RoleIdParamDto;
      const role = await roleService.findOne(params.id);
      res.json(role);
    } catch (error) {
      next(error);
    }
  },
);


}
