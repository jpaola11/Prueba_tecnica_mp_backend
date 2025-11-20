import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { AuditLogService } from './audit-log.service';
import { AuditLogQueryDto } from './dto/query-audit-log.dto';
import { AuditLogIdParamDto } from './dto/id-audit-log.dto';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { RegisterSimpleAuditLogDto } from './dto/register-simple-audit-log.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildAuditLogRouter(auditLogService: AuditLogService): Router {
  const router = Router();

  /**
   * @openapi
   * /audit-logs:
   *   get:
   *     summary: Listar logs de auditoría
   *     description: Devuelve la lista paginada de logs de auditoría registrados en el sistema, filtrada según los parámetros de consulta proporcionados.
   *     tags:
   *       - Logs de auditoría
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: tableName
   *         required: false
   *         description: Nombre de la tabla sobre la cual se generó el log.
   *         schema:
   *           type: string
   *       - in: query
   *         name: operation
   *         required: false
   *         description: Tipo de operación registrada (por ejemplo, INSERT, UPDATE, DELETE).
   *         schema:
   *           type: string
   *       - in: query
   *         name: userId
   *         required: false
   *         description: Identificador del usuario asociado al log.
   *         schema:
   *           type: integer
   *           format: int32
   *       - in: query
   *         name: recordPk
   *         required: false
   *         description: Clave primaria del registro afectado.
   *         schema:
   *           type: string
   *       - in: query
   *         name: fromDate
   *         required: false
   *         description: Fecha inicial (incluida) para filtrar la creación de logs.
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: toDate
   *         required: false
   *         description: Fecha final (incluida) para filtrar la creación de logs.
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: page
   *         required: false
   *         description: Número de página para paginación.
   *         schema:
   *           type: integer
   *           format: int32
   *       - in: query
   *         name: limit
   *         required: false
   *         description: Cantidad máxima de registros por página.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Listado de logs de auditoría obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ListAuditLogResponseDto'
   *       400:
   *         description: Parámetros de búsqueda inválidos o error de validación.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar listar los logs de auditoría.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/',
    jwtAuthMiddleware,
    validateDto(AuditLogQueryDto, 'query'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = req.query as unknown as AuditLogQueryDto;
        const result = await auditLogService.findAll(query);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /audit-logs/{id}:
   *   get:
   *     summary: Obtener detalle de un log de auditoría
   *     description: Devuelve el detalle de un log de auditoría específico identificado por su identificador numérico.
   *     tags:
   *       - Logs de auditoría
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Identificador numérico del log de auditoría.
   *         schema:
   *           type: integer
   *           format: int32
   *     responses:
   *       200:
   *         description: Log de auditoría obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuditLogResponseDto'
   *       400:
   *         description: Parámetro de ruta inválido o error de validación.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El log de auditoría solicitado no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar obtener el log de auditoría.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/:id',
    jwtAuthMiddleware,
    validateDto(AuditLogIdParamDto, 'params'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const params = req.params as unknown as AuditLogIdParamDto;
        const log = await auditLogService.findOne(params.id);
        res.json(log);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /audit-logs:
   *   post:
   *     summary: Registrar log de auditoría
   *     description: Registra un nuevo log de auditoría con la información completa proporcionada en el cuerpo de la solicitud.
   *     tags:
   *       - Logs de auditoría
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAuditLogDto'
   *     responses:
   *       201:
   *         description: Log de auditoría registrado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos del log de auditoría.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar registrar el log de auditoría.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/',
    jwtAuthMiddleware,
    validateDto(CreateAuditLogDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as CreateAuditLogDto;
        await auditLogService.register(dto);
        res.status(201).json({
          message: 'Log de auditoría registrado correctamente.',
        });
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /audit-logs/simple:
   *   post:
   *     summary: Registrar log de auditoría simplificado
   *     description: Registra un log de auditoría utilizando una estructura simplificada; el usuario autenticado se asocia automáticamente al registro.
   *     tags:
   *       - Logs de auditoría
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterSimpleAuditLogDto'
   *     responses:
   *       201:
   *         description: Log de auditoría simplificado registrado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Solicitud inválida o error de validación en los datos del log de auditoría simplificado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar registrar el log de auditoría simplificado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/simple',
    jwtAuthMiddleware,
    validateDto(RegisterSimpleAuditLogDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as RegisterSimpleAuditLogDto;
        const currentUserId = Number(req.user?.id);

        await auditLogService.registerSimple({
          tableName: dto.tableName,
          recordPk: dto.recordPk,
          operation: dto.operation,
          userId: Number.isFinite(currentUserId) ? currentUserId : undefined,
          oldValues: dto.oldValues,
          newValues: dto.newValues,
          sourceIp: dto.sourceIp,
          userAgent: dto.userAgent,
          correlationId: dto.correlationId,
        });

        res.status(201).json({
          message: 'Log de auditoría simplificado registrado correctamente.',
        });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}