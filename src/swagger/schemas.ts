// src/swagger/schemas.ts

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     GenericMessageResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la operación.
 *       required:
 *         - message
 *
 *     CreateUserResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la creación.
 *         userId:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario recién creado.
 *       required:
 *         - message
 *         - userId
 *
 *     UserResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         mustChangePassword:
 *           type: boolean
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: integer
 *           format: int32
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *       required:
 *         - id
 *         - username
 *         - email
 *         - fullName
 *         - orgUnitId
 *         - isActive
 *         - mustChangePassword
 *         - lastLoginAt
 *         - createdAt
 *         - createdBy
 *         - updatedAt
 *         - updatedBy
 *         - isDeleted
 *         - deletedAt
 *         - deletedBy
 *
 *     PaginatedUserResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de registros que cumplen el filtro.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página actual (1-based).
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad de registros por página.
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *
 *     CreateUserDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: jdoe
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 200
 *           example: P@ssw0rd2025
 *         email:
 *           type: string
 *           format: email
 *           minLength: 1
 *           maxLength: 200
 *           example: jdoe@mp.gob.gt
 *         fullName:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: Juan Pérez López
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           example: 5
 *         isActive:
 *           type: boolean
 *           default: true
 *           example: true
 *         mustChangePassword:
 *           type: boolean
 *           default: false
 *           example: false
 *       required:
 *         - username
 *         - password
 *         - email
 *         - fullName
 *
 *     UpdateUserDto:
 *       type: object
 *       description: Campos editables de un usuario existente. Todos son opcionales.
 *       properties:
 *         username:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           minLength: 1
 *           maxLength: 200
 *         fullName:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         mustChangePassword:
 *           type: boolean
 *
 *     UpdateUserPasswordDto:
 *       type: object
 *       properties:
 *         currentPassword:
 *           type: string
 *           minLength: 8
 *           maxLength: 200
 *           description: Contraseña actual del usuario.
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           maxLength: 200
 *           description: Nueva contraseña a establecer.
 *         confirmNewPassword:
 *           type: string
 *           minLength: 8
 *           maxLength: 200
 *           description: Confirmación de la nueva contraseña.
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmNewPassword
 */
