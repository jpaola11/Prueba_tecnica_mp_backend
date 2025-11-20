// Router

import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseReviewService } from './case-review.service';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';
import { CaseReviewQueryDto } from './dto/query-case-rewiew.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildCaseReviewRouter(
  caseReviewService: CaseReviewService,
): Router {
  const router = Router();

  /**
   * @openapi
   * /case-reviews:
   *   get:
   *     summary: Listar revisiones de un expediente
   *     description: Devuelve un listado paginado de revisiones asociadas a un expediente específico, identificado por su caseId.
   *     tags:
   *       - Revisiones de expedientes
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listado de revisiones del expediente obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedCaseReviewResponseDto'
   *       400:
   *         description: Parámetros de consulta inválidos o falta el identificador del expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: No se encontraron revisiones para el expediente especificado o el expediente no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar las revisiones del expediente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(CaseReviewQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as CaseReviewQueryDto;
        const result = await caseReviewService.listReviewsByCase(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-reviews:
   *   post:
   *     summary: Registrar una revisión de expediente
   *     description: Registra una nueva revisión de un expediente, almacenando el cambio de estado, comentario y datos del revisor.
   *     tags:
   *       - Revisiones de expedientes
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCaseReviewDto'
   *     responses:
   *       201:
   *         description: Revisión registrada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateCaseReviewResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos de la revisión.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El expediente asociado a la revisión no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       409:
   *         description: El nuevo estado es igual al estado anterior o la operación entra en conflicto con el estado actual.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar registrar la revisión.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseReviewDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateCaseReviewDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseReviewService.registerReview(
          dto,
          currentUserId,
        );
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
