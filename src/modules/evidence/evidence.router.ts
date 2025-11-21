// Router

import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/evidence.update.dto';
import { EvidenceQueryDto } from './dto/query-evidence.dto';
import { EvidenceIdParamDto } from './dto/id-evidence.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildEvidenceRouter(evidenceService: EvidenceService): Router {
  const router = Router();

  /**
   * @openapi
   * /evidences:
   *   get:
   *     summary: Listar evidencias de un expediente
   *     description: Devuelve un listado paginado de evidencias asociadas a un expediente específico, identificado mediante parámetros de consulta.
   *     tags:
   *       - Evidencias
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listado de evidencias del expediente obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedEvidenceResponseDto'
   *       400:
   *         description: Parámetros de consulta inválidos o falta el identificador del expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar las evidencias del expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(EvidenceQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as EvidenceQueryDto;
        const result = await evidenceService.listEvidencesByCase(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /evidences:
   *   post:
   *     summary: Registrar una evidencia
   *     description: Registra una nueva evidencia asociada a un expediente, utilizando los datos proporcionados en la solicitud.
   *     tags:
   *       - Evidencias
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEvidenceDto'
   *     responses:
   *       201:
   *         description: Evidencia registrada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateEvidenceResponseDto'
   *       400:
   *         description: Solicitud inválida o falta el identificador del expediente asociado a la evidencia.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: Ya existe una evidencia con el mismo número de secuencia para el expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar registrar la evidencia.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateEvidenceDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateEvidenceDto;
        const currentUserId = Number(req.user?.id);
        const result = await evidenceService.addEvidence(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /evidences/{id}:
   *   put:
   *     summary: Actualizar una evidencia
   *     description: Actualiza los datos de una evidencia existente identificada por su identificador numérico.
   *     tags:
   *       - Evidencias
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico de la evidencia a actualizar.
   *         schema:
   *           type: integer
   *           format: int32
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateEvidenceDto'
   *     responses:
   *       200:
   *         description: Evidencia actualizada correctamente.
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
   *         description: La evidencia a actualizar no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar actualizar la evidencia.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.put(
    '/:id',
    jwtAuthMiddleware,
    validateDto(EvidenceIdParamDto, 'params'),
    validateDto(UpdateEvidenceDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as EvidenceIdParamDto;
        const dto = req.body as UpdateEvidenceDto;
        const currentUserId = Number(req.user?.id);
        const result = await evidenceService.updateEvidence(
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
   * /evidences/{id}:
   *   delete:
   *     summary: Eliminar lógicamente una evidencia
   *     description: Realiza el borrado lógico de una evidencia, marcándola como eliminada sin removerla físicamente de la base de datos.
   *     tags:
   *       - Evidencias
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico de la evidencia a eliminar.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Evidencia eliminada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: La evidencia no existe o ya fue eliminada previamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar eliminar la evidencia.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.delete(
    '/:id',
    jwtAuthMiddleware,
    validateDto(EvidenceIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as EvidenceIdParamDto;
        const currentUserId = Number(req.user?.id);
        const result = await evidenceService.softDeleteEvidence(
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
 * /evidence/{id}:
 *   get:
 *     summary: Obtener detalle de una evidencia
 *     description: Retorna la información completa de una evidencia asociada a un expediente.
 *     tags:
 *       - Evidencias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identificador de la evidencia.
 *     responses:
 *       200:
 *         description: Evidencia obtenida correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       404:
 *         description: Evidencia no encontrada.
 *       500:
 *         description: Error interno.
 */
router.get(
  '/:id',
  jwtAuthMiddleware,
  validateDto(EvidenceIdParamDto, 'params'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const params = req.params as unknown as EvidenceIdParamDto;
      const evidence = await evidenceService.findOne(params.id);
      res.json(evidence);
    } catch (error) {
      next(error);
    }
  },
);


  return router;

  

}
