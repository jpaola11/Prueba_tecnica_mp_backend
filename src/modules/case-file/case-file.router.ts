// Router

import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseFileService } from './case-file.service';
import { CreateCaseFileDto } from './dto/create-case-file.dto';
import { UpdateCaseFileDto } from './dto/case-file.upadate.dto';
import { CaseFileQueryDto } from './dto/query-case-file.dto';
import { CaseFileIdParamDto } from './dto/id-case-file.dto';
import { ChangeCaseStatusDto } from './dto/change-case-status.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildCaseFileRouter(caseFileService: CaseFileService): Router {
  const router = Router();

  /**
   * @openapi
   * /case-files:
   *   get:
   *     summary: Listar expedientes
   *     description: Devuelve un listado paginado de expedientes según los filtros y parámetros de búsqueda proporcionados.
   *     tags:
   *       - Expedientes
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listado de expedientes obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedCaseFileResponseDto'
   *       400:
   *         description: Parámetros de consulta inválidos o error en los filtros de búsqueda.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar los expedientes.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(CaseFileQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as CaseFileQueryDto;
        const result = await caseFileService.listCases(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-files/{id}:
   *   get:
   *     summary: Obtener detalle de un expediente
   *     description: Obtiene la información detallada de un expediente específico a partir de su identificador.
   *     tags:
   *       - Expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del expediente.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Expediente obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CaseFileResponseDto'
   *       404:
   *         description: El expediente solicitado no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar obtener el expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseFileIdParamDto;
        const item = await caseFileService.getCaseById(params.id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-files:
   *   post:
   *     summary: Crear un nuevo expediente
   *     description: Crea un nuevo expediente en el sistema utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Expedientes
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCaseFileDto'
   *     responses:
   *       201:
   *         description: Expediente creado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateCaseFileResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos del expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar crear el expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseFileDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateCaseFileDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseFileService.createCase(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-files/{id}:
   *   put:
   *     summary: Actualizar un expediente
   *     description: Actualiza la información de un expediente existente utilizando los datos proporcionados.
   *     tags:
   *       - Expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del expediente a actualizar.
   *         schema:
   *           type: integer
   *           format: int32
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCaseFileDto'
   *     responses:
   *       200:
   *         description: Expediente actualizado correctamente.
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
   *         description: El expediente a actualizar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar actualizar el expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    validateDto(UpdateCaseFileDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseFileIdParamDto;
        const dto = req.body as UpdateCaseFileDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseFileService.updateCase(
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
   * /case-files/{id}/status:
   *   patch:
   *     summary: Cambiar el estado de un expediente
   *     description: Modifica el estado de un expediente específico según el estado objetivo proporcionado.
   *     tags:
   *       - Expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del expediente cuyo estado se desea cambiar.
   *         schema:
   *           type: integer
   *           format: int32
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangeCaseStatusDto'
   *     responses:
   *       200:
   *         description: Estado del expediente actualizado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Solicitud inválida, transición de estado no permitida o error de validación.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El expediente cuyo estado se desea cambiar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar cambiar el estado del expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.patch(
    '/:id/status',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    validateDto(ChangeCaseStatusDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseFileIdParamDto;
        const dto = req.body as ChangeCaseStatusDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseFileService.changeStatus(
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
   * /case-files/{id}:
   *   delete:
   *     summary: Eliminar lógicamente un expediente
   *     description: Realiza el borrado lógico de un expediente, marcándolo como eliminado sin removerlo físicamente de la base de datos.
   *     tags:
   *       - Expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del expediente a eliminar.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Expediente eliminado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Solicitud inválida o intento de eliminar un expediente ya eliminado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El expediente a eliminar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar eliminar el expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseFileIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseFileIdParamDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseFileService.softDeleteCase(
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
