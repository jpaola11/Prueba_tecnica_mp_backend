// Router

import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { OrgUnitService } from './org-unit.service';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/org-unit.update.dto';
import { OrgUnitQueryDto } from './dto/query-unit.dto';
import { OrgUnitIdParamDto } from './dto/id-org-unit.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildOrgUnitRouter(orgUnitService: OrgUnitService): Router {
  const router = Router();

  /**
   * @openapi
   * /org-units:
   *   get:
   *     summary: Listar unidades organizacionales activas
   *     description: Devuelve un listado paginado de unidades organizacionales activas según los parámetros de consulta proporcionados.
   *     tags:
   *       - Unidades organizacionales
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listado de unidades organizacionales obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedOrgUnitResponseDto'
   *       400:
   *         description: Parámetros de consulta inválidos o error en los filtros de búsqueda.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar las unidades organizacionales.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(OrgUnitQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as OrgUnitQueryDto;
        const result = await orgUnitService.listOrgUnits(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /org-units/{id}:
   *   get:
   *     summary: Obtener detalle de una unidad organizacional
   *     description: Obtiene la información detallada de una unidad organizacional específica a partir de su identificador.
   *     tags:
   *       - Unidades organizacionales
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico de la unidad organizacional a consultar.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Unidad organizacional obtenida correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OrgUnitResponseDto'
   *       404:
   *         description: La unidad organizacional solicitada no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar obtener la unidad organizacional.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(OrgUnitIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as OrgUnitIdParamDto;
        const item = await orgUnitService.getOrgUnitById(params.id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /org-units:
   *   post:
   *     summary: Crear una unidad organizacional
   *     description: Crea una nueva unidad organizacional utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Unidades organizacionales
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateOrgUnitDto'
   *     responses:
   *       201:
   *         description: Unidad organizacional creada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateOrgUnitResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos de la unidad organizacional.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe una unidad organizacional con el mismo código (violación de índice único).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar crear la unidad organizacional.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateOrgUnitDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateOrgUnitDto;
        const currentUserId = Number(req.user?.id);
        const result = await orgUnitService.createOrgUnit(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /org-units/{id}:
   *   put:
   *     summary: Actualizar una unidad organizacional
   *     description: Actualiza los datos de una unidad organizacional existente utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Unidades organizacionales
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico de la unidad organizacional a actualizar.
   *         schema:
   *           type: integer
   *           format: int32
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateOrgUnitDto'
   *     responses:
   *       200:
   *         description: Unidad organizacional actualizada correctamente.
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
   *         description: La unidad organizacional a actualizar no existe o fue eliminada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe una unidad organizacional con el mismo código (violación de índice único).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar actualizar la unidad organizacional.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(OrgUnitIdParamDto, 'params'),
    validateDto(UpdateOrgUnitDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as OrgUnitIdParamDto;
        const dto = req.body as UpdateOrgUnitDto;
        const currentUserId = Number(req.user?.id);
        const result = await orgUnitService.updateOrgUnit(
          params.id,
          dto,
          currentUserId,
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /org-units/{id}:
   *   delete:
   *     summary: Eliminar lógicamente una unidad organizacional
   *     description: Realiza el borrado lógico de una unidad organizacional, marcándola como eliminada sin removerla físicamente de la base de datos.
   *     tags:
   *       - Unidades organizacionales
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico de la unidad organizacional a eliminar.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Unidad organizacional eliminada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: La unidad organizacional no existe o ya fue eliminada previamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar eliminar la unidad organizacional.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(OrgUnitIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as OrgUnitIdParamDto;
        const currentUserId = Number(req.user?.id);
        const result = await orgUnitService.softDeleteOrgUnit(
          params.id,
          currentUserId,
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );


  
  /**
 * @openapi
 * /org-unit/{id}:
 *   get:
 *     summary: Obtener detalle de una unidad organizacional
 *     description: Devuelve la información de una unidad organizacional dentro de la estructura institucional.
 *     tags:
 *       - Unidades organizacionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Identificador de la unidad organizacional.
 *         required: true
 *     responses:
 *       200:
 *         description: Unidad obtenida correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       404:
 *         description: Unidad no encontrada.
 *       500:
 *         description: Error interno.
 */
router.get(
  '/:id',
  jwtAuthMiddleware,
  validateDto(OrgUnitIdParamDto, 'params'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const params = req.params as unknown as OrgUnitIdParamDto;
      const unit = await orgUnitService.findOne(params.id);
      res.json(unit);
    } catch (error) {
      next(error);
    }
  },
);

  return router;



}
