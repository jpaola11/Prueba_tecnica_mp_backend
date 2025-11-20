// Router

import { Router, Request, Response, NextFunction } from 'express';
import { jwtAuthMiddleware } from '../../middlewares/jwt-auth.middleware';
import { validateDto } from '../../middlewares/validate-dto.middleware';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

type AuthUser = {
  id: number;
  [key: string]: any;
};

interface AuthRequest extends Request {
  user?: AuthUser;
}

export function buildAuthRouter(authService: AuthService): Router {
  const router = Router();

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Autenticar usuario y emitir tokens JWT
   *     description: Autentica a un usuario a partir de sus credenciales y devuelve los tokens de acceso y actualización junto con información relevante del usuario.
   *     tags:
   *       - Autenticación
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDto'
   *     responses:
   *       200:
   *         description: Autenticación exitosa; se devuelven tokens JWT y datos del usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponseDto'
   *       400:
   *         description: Solicitud inválida o datos de autenticación incompletos/incorrectos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       401:
   *         description: Credenciales inválidas; autenticación rechazada.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar autenticar al usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/login',
    validateDto(LoginDto, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as LoginDto;
        const result = await authService.login(dto);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /auth/refresh:
   *   post:
   *     summary: Refrescar tokens JWT a partir de un refresh token
   *     description: Recibe un refresh token válido y devuelve un nuevo par de tokens JWT (access y refresh).
   *     tags:
   *       - Autenticación
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshTokenDto'
   *     responses:
   *       200:
   *         description: Tokens refrescados correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RefreshTokenResponseDto'
   *       400:
   *         description: Solicitud inválida o refresh token mal formado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       401:
   *         description: Refresh token inválido, expirado o no reconocido.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar refrescar los tokens.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/refresh',
    validateDto(RefreshTokenDto, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as RefreshTokenDto;
        const result = await authService.refresh(dto);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /auth/me:
   *   get:
   *     summary: Obtener el perfil del usuario autenticado
   *     description: Devuelve la información de perfil del usuario asociado al token JWT enviado en la cabecera de autorización.
   *     tags:
   *       - Autenticación
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Perfil del usuario obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *       401:
   *         description: Token de autenticación ausente, inválido o expirado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El usuario asociado al token no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar obtener el perfil del usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.get(
    '/me',
    jwtAuthMiddleware,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const userId = Number(req.user?.id);
        const result = await authService.getProfile(userId);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /auth/change-password:
   *   post:
   *     summary: Cambiar la contraseña del usuario autenticado
   *     description: Permite al usuario autenticado cambiar su contraseña validando la contraseña actual y la confirmación de la nueva contraseña.
   *     tags:
   *       - Autenticación
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePasswordDto'
   *     responses:
   *       200:
   *         description: Contraseña actualizada correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       400:
   *         description: Contraseña actual incorrecta o confirmación de nueva contraseña no coincide, o datos inválidos.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       401:
   *         description: Token de autenticación ausente, inválido o expirado.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       404:
   *         description: El usuario autenticado no existe.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   *       500:
   *         description: Error interno del servidor al intentar cambiar la contraseña del usuario.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GenericMessageResponseDto'
   */
  router.post(
    '/change-password',
    jwtAuthMiddleware,
    validateDto(ChangePasswordDto, 'body'),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as ChangePasswordDto;
        const userId = Number(req.user?.id);
        const result = await authService.changePassword(userId, dto);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
