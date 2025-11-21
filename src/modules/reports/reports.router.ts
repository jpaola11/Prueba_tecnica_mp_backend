import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { ReportsService } from '../reports/reports.service';
import { CaseStatusSummaryQueryDto } from './dto/case-status-summary-query.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Construye el router de Reportes.
 *
 * Se espera montarlo en /reports.
 */
export function buildReportsRouter(reportsService: ReportsService): Router {
  const router = Router();

  /**
   * @openapi
   * /reports/case-status-summary:
   *   get:
   *     summary: Resumen de expedientes por unidad y estado
   *     description: |
   *       Devuelve un resumen consolidado de expedientes agrupados por unidad organizacional
   *       y por estado (abiertos, en trámite y cerrados), filtrado por rango de fechas,
   *       unidad y estado agrupado.
   *     tags:
   *       - Reportes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: orgUnitId
   *         required: false
   *         description: Identificador de la unidad organizacional a filtrar.
   *         schema:
   *           type: integer
   *           format: int32
   *       - in: query
   *         name: status
   *         required: false
   *         description: |
   *           Grupo de estado a filtrar:
   *             - OPEN: expedientes abiertos.
   *             - IN_PROGRESS: expedientes en trámite.
   *             - CLOSED: expedientes cerrados (aprobados o rechazados).
   *         schema:
   *           type: string
   *           enum: [OPEN, IN_PROGRESS, CLOSED]
   *       - in: query
   *         name: fromDate
   *         required: false
   *         description: Fecha inicial (YYYY-MM-DD) para filtrar por fecha de apertura.
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: toDate
   *         required: false
   *         description: Fecha final (YYYY-MM-DD) para filtrar por fecha de apertura.
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Resumen generado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CaseStatusSummaryRowDto'
   *       400:
   *         description: Parámetros de consulta inválidos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar generar el resumen.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/case-status-summary',
    jwtAuthMiddleware,
    validateDto(CaseStatusSummaryQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as CaseStatusSummaryQueryDto;
        const result = await reportsService.caseStatusSummary(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /reports/case-status-summary/excel:
   *   get:
   *     summary: Exportar resumen de expedientes a Excel
   *     description: Genera un archivo Excel con el resumen de expedientes por unidad y estado.
   *     tags:
   *       - Reportes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: orgUnitId
   *         required: false
   *         schema:
   *           type: integer
   *           format: int32
   *         description: Identificador de la unidad organizacional a filtrar.
   *       - in: query
   *         name: status
   *         required: false
   *         schema:
   *           type: string
   *           enum: [OPEN, IN_PROGRESS, CLOSED]
   *         description: Grupo de estado por el que se filtrará.
   *       - in: query
   *         name: fromDate
   *         required: false
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: toDate
   *         required: false
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Archivo Excel generado correctamente.
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros de consulta inválidos.
   *       500:
   *         description: Error interno al generar el archivo Excel.
   */
  router.get(
    '/case-status-summary/excel',
    jwtAuthMiddleware,
    validateDto(CaseStatusSummaryQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as CaseStatusSummaryQueryDto;
        const buffer = await reportsService.exportCaseStatusSummaryExcel(query);

        res
          .status(200)
          .setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          )
          .setHeader(
            'Content-Disposition',
            'attachment; filename="reporte-resumen-expedientes.xlsx"'
          )
          .send(buffer);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @openapi
   * /reports/case-status-summary/pdf:
   *   get:
   *     summary: Exportar resumen de expedientes a PDF
   *     description: Genera un archivo PDF con el resumen de expedientes por unidad y estado.
   *     tags:
   *       - Reportes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: orgUnitId
   *         required: false
   *         schema:
   *           type: integer
   *           format: int32
   *       - in: query
   *         name: status
   *         required: false
   *         schema:
   *           type: string
   *           enum: [OPEN, IN_PROGRESS, CLOSED]
   *       - in: query
   *         name: fromDate
   *         required: false
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: toDate
   *         required: false
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Archivo PDF generado correctamente.
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros de consulta inválidos.
   *       500:
   *         description: Error interno al generar el archivo PDF.
   */
  router.get(
    '/case-status-summary/pdf',
    jwtAuthMiddleware,
    validateDto(CaseStatusSummaryQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as CaseStatusSummaryQueryDto;
        const buffer = await reportsService.exportCaseStatusSummaryPdf(query);

        res
          .status(200)
          .setHeader('Content-Type', 'application/pdf')
          .setHeader(
            'Content-Disposition',
            'attachment; filename="reporte-resumen-expedientes.pdf"'
          )
          .send(buffer);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
