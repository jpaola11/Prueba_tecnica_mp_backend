import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseStatusService } from './case-status.service';
import { CreateCaseStatusDto } from './dto/create-case-status.dto';
import { UpdateCaseStatusDto } from './dto/case-status.update.dto';
import { CaseStatusQueryDto } from './dto/query-case-status.dto';
import { CaseStatusIdParamDto } from './dto/id-case-status.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildCaseStatusRouter(
  caseStatusService: CaseStatusService,
): Router {
  const router = Router();

  /**
   * @openapi
   * /case-statuses:
   *   get:
   *     summary: Listar estados de expediente activos
   *     description: Devuelve el catálogo de estados de expediente activos, incluyendo información básica y metadatos de creación.
   *     tags:
   *       - Estados de expedientes
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listado de estados de expediente activos obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ListCaseStatusResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar los estados de expediente activos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(CaseStatusQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        await req.query; // validación ya fue realizada por el middleware
        const result = await caseStatusService.listActiveStatuses();
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-statuses:
   *   post:
   *     summary: Crear un nuevo estado de expediente
   *     description: Crea un nuevo estado de expediente en el catálogo, utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Estados de expedientes
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCaseStatusDto'
   *     responses:
   *       201:
   *         description: Estado de expediente creado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateCaseStatusResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos del estado de expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe un estado de expediente con el mismo código (violación de índice único).
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar crear el estado de expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseStatusDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateCaseStatusDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseStatusService.createStatus(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-statuses/{id}:
   *   put:
   *     summary: Actualizar un estado de expediente
   *     description: Actualiza los datos de un estado de expediente existente identificado por su identificador numérico.
   *     tags:
   *       - Estados de expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del estado de expediente a actualizar.
   *         schema:
   *           type: integer
   *           format: int32
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCaseStatusDto'
   *     responses:
   *       200:
   *         description: Estado de expediente actualizado correctamente.
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
   *         description: El estado de expediente a actualizar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar actualizar el estado de expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseStatusIdParamDto, 'params'),
    validateDto(UpdateCaseStatusDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseStatusIdParamDto;
        const dto = req.body as UpdateCaseStatusDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseStatusService.updateStatus(
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
   * /case-statuses/{id}:
   *   delete:
   *     summary: Eliminar lógicamente un estado de expediente
   *     description: Realiza el borrado lógico de un estado de expediente, marcándolo como eliminado en el catálogo.
   *     tags:
   *       - Estados de expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del estado de expediente a eliminar.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Estado de expediente eliminado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Solicitud inválida o error al intentar eliminar el estado de expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El estado de expediente no existe o ya fue eliminado previamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar eliminar el estado de expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseStatusIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseStatusIdParamDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseStatusService.softDeleteStatus(
          params.id,
          currentUserId,
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
