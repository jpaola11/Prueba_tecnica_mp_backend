import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { CaseReviewService } from './case-review.service';
import { CreateCaseReviewDto } from './dto/create-case-review.dto';
import { CaseReviewQueryDto } from './dto/query-case-rewiew.dto';
import { CaseReviewIdParamDto } from './dto/id-case-review.dto';

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
   *     summary: Listar revisiones de expedientes
   *     description: Devuelve un listado paginado y filtrado de revisiones de expedientes.
   *     tags:
   *       - Revisiones de expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: caseId
   *       - in: query
   *         name: reviewerId
   *       - in: query
   *         name: previousStatusId
   *       - in: query
   *         name: newStatusId
   *       - in: query
   *         name: search
   *     responses:
   *       200:
   *         description: Listado obtenido correctamente.
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
   *     description: Registra un cambio de estado, comentario y datos del revisor.
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
   *         description: Revisión creada correctamente.
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateCaseReviewDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateCaseReviewDto;
        const currentUserId = Number(req.user?.id);
        const result = await caseReviewService.registerReview(dto, currentUserId);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /case-reviews/{id}:
   *   get:
   *     summary: Obtener detalle de una revisión de expediente
   *     description: Devuelve una revisión específica.
   *     tags:
   *       - Revisiones de expedientes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: Identificador de la revisión.
   *     responses:
   *       200:
   *         description: Revisión obtenida correctamente.
   *       404:
   *         description: Revisión no encontrada.
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(CaseReviewIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as CaseReviewIdParamDto;
        const review = await caseReviewService.findOne(params.id);
        res.json(review);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
