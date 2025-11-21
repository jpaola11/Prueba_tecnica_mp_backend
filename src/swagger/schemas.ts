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
/**
 * @openapi
 * components:
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
 *     CreateRoleResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la creación del rol.
 *         roleId:
 *           type: integer
 *           format: int32
 *           description: Identificador del rol recién creado.
 *       required:
 *         - message
 *         - roleId
 *
 *     RoleResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único del rol.
 *         code:
 *           type: string
 *           description: Código único del rol.
 *         name:
 *           type: string
 *           description: Nombre legible del rol.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción detallada del rol o null si no se ha definido.
 *         isDefault:
 *           type: boolean
 *           description: Indica si el rol es el rol predeterminado del sistema.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del rol.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización del rol, o null si nunca se ha actualizado.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización, o null si nunca se ha actualizado.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si el rol ha sido eliminado lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico, o null si el rol sigue activo.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico, o null si no aplica.
 *       required:
 *         - id
 *         - code
 *         - name
 *         - description
 *         - isDefault
 *         - createdAt
 *         - createdBy
 *         - updatedAt
 *         - updatedBy
 *         - isDeleted
 *         - deletedAt
 *         - deletedBy
 *
 *     ListRoleResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de roles que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/RoleResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de roles que cumplen el filtro.
 *       required:
 *         - items
 *         - total
 *
 *     CreateRoleDto:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Código único del rol.
 *           example: ADMIN
 *         name:
 *           type: string
 *           description: Nombre legible del rol.
 *           example: Administrador del sistema
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción opcional del rol.
 *           example: Rol con acceso completo a las funcionalidades del sistema.
 *         isDefault:
 *           type: boolean
 *           description: Indica si el rol debe marcarse como predeterminado.
 *           example: false
 *           default: false
 *       required:
 *         - code
 *         - name
 *
 *     UpdateRoleDto:
 *       type: object
 *       description: Campos editables del rol. Todos los campos son opcionales.
 *       properties:
 *         code:
 *           type: string
 *           description: Nuevo código único del rol.
 *           example: SUPERVISOR
 *         name:
 *           type: string
 *           description: Nuevo nombre legible del rol.
 *           example: Supervisor de casos
 *         description:
 *           type: string
 *           nullable: true
 *           description: Nueva descripción del rol.
 *           example: Rol encargado de supervisar expedientes.
 *         isDefault:
 *           type: boolean
 *           description: Indica si el rol debe establecerse o no como predeterminado.
 *           example: false
 *       required: []
 *
 *     RoleQueryDto:
 *       type: object
 *       description: Filtros opcionales para listar roles.
 *       properties:
 *         search:
 *           type: string
 *           description: Texto de búsqueda para filtrar por código o nombre de rol.
 *           example: admin
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación (si aplica).
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de registros por página (si aplica).
 *           example: 20
 *           default: 20
 *       required: []
 */

/**
 * @openapi
 * components:
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
 *     AuditLogResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único del log de auditoría.
 *         tableName:
 *           type: string
 *           description: Nombre de la tabla sobre la cual se generó el log.
 *         recordPk:
 *           type: string
 *           description: Clave primaria del registro afectado, representada como cadena.
 *         operation:
 *           type: string
 *           description: Tipo de operación registrada (por ejemplo, INSERT, UPDATE, DELETE).
 *         userId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario asociado al log, o null si no aplica.
 *         oldValues:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *           description: Valores previos del registro antes de la operación, si aplica.
 *         newValues:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *           description: Valores posteriores del registro después de la operación, si aplica.
 *         sourceIp:
 *           type: string
 *           nullable: true
 *           description: Dirección IP de origen desde la cual se generó la acción.
 *         userAgent:
 *           type: string
 *           nullable: true
 *           description: User-Agent del cliente que originó la petición.
 *         correlationId:
 *           type: string
 *           nullable: true
 *           description: Identificador de correlación para trazar la operación de extremo a extremo.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se registró el log de auditoría.
 *       required:
 *         - id
 *         - tableName
 *         - recordPk
 *         - operation
 *         - createdAt
 *
 *     ListAuditLogResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de logs de auditoría que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/AuditLogResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de logs de auditoría que cumplen el filtro.
 *       required:
 *         - items
 *         - total
 *
 *     CreateAuditLogDto:
 *       type: object
 *       properties:
 *         tableName:
 *           type: string
 *           description: Nombre de la tabla sobre la cual se generará el log de auditoría.
 *           example: users
 *         recordPk:
 *           description: Clave primaria del registro afectado. Se acepta valor numérico o cadena.
 *           oneOf:
 *             - type: string
 *             - type: integer
 *               format: int32
 *         operation:
 *           type: string
 *           description: Tipo de operación que se está registrando (por ejemplo, INSERT, UPDATE, DELETE).
 *           example: UPDATE
 *         userId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador explícito del usuario asociado al log, si se desea registrar manualmente.
 *         oldValues:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *           description: Representación JSON de los valores previos del registro.
 *         newValues:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *           description: Representación JSON de los valores posteriores del registro.
 *         sourceIp:
 *           type: string
 *           nullable: true
 *           description: Dirección IP de origen desde la cual se generó la acción.
 *         userAgent:
 *           type: string
 *           nullable: true
 *           description: User-Agent del cliente que originó la petición.
 *         correlationId:
 *           type: string
 *           nullable: true
 *           description: Identificador de correlación para trazar la operación.
 *       required:
 *         - tableName
 *         - recordPk
 *         - operation
 *
 *     RegisterSimpleAuditLogDto:
 *       type: object
 *       properties:
 *         tableName:
 *           type: string
 *           description: Nombre de la tabla sobre la cual se generará el log de auditoría.
 *           example: users
 *         recordPk:
 *           description: Clave primaria del registro afectado. Se acepta valor numérico o cadena.
 *           oneOf:
 *             - type: string
 *             - type: integer
 *               format: int32
 *         operation:
 *           type: string
 *           description: Tipo de operación que se está registrando (por ejemplo, INSERT, UPDATE, DELETE).
 *           example: UPDATE
 *         oldValues:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *           description: Representación JSON de los valores previos del registro.
 *         newValues:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *           description: Representación JSON de los valores posteriores del registro.
 *         sourceIp:
 *           type: string
 *           nullable: true
 *           description: Dirección IP de origen desde la cual se generó la acción.
 *         userAgent:
 *           type: string
 *           nullable: true
 *           description: User-Agent del cliente que originó la petición.
 *         correlationId:
 *           type: string
 *           nullable: true
 *           description: Identificador de correlación para trazar la operación.
 *       required:
 *         - tableName
 *         - recordPk
 *         - operation
 *
 *     AuditLogQueryDto:
 *       type: object
 *       description: Filtros opcionales para la búsqueda y paginación de logs de auditoría.
 *       properties:
 *         tableName:
 *           type: string
 *           description: Nombre de la tabla a filtrar.
 *         operation:
 *           type: string
 *           description: Tipo de operación a filtrar (por ejemplo, INSERT, UPDATE, DELETE).
 *         userId:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario asociado a los logs.
 *         recordPk:
 *           type: string
 *           description: Clave primaria del registro afectado.
 *         fromDate:
 *           type: string
 *           format: date-time
 *           description: Fecha inicial (incluida) para filtrar los logs por fecha de creación.
 *         toDate:
 *           type: string
 *           format: date-time
 *           description: Fecha final (incluida) para filtrar los logs por fecha de creación.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de registros por página.
 *           example: 20
 *           default: 20
 *       required: []
 *
 *     AuditLogIdParamDto:
 *       type: object
 *       description: Parámetros de ruta para identificar un log de auditoría específico.
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador numérico del log de auditoría.
 *       required:
 *         - id
 */


/**
 * @openapi
 * components:
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
 *     CaseFileResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único del expediente.
 *         code:
 *           type: string
 *           description: Código único asignado al expediente.
 *         title:
 *           type: string
 *           description: Título o asunto principal del expediente.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción detallada del expediente.
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador de la unidad organizacional asociada, si aplica.
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Identificador del técnico o responsable asignado al expediente.
 *         statusId:
 *           type: integer
 *           format: int32
 *           description: Identificador del estado actual del expediente.
 *         openDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de apertura del expediente.
 *         closeDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de cierre del expediente, si ya fue cerrado.
 *         referenceExternal:
 *           type: string
 *           nullable: true
 *           description: Referencia externa asociada al expediente, si aplica.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del expediente.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el expediente.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización del expediente.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si el expediente ha sido eliminado lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico del expediente.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico.
 *       required:
 *         - id
 *         - code
 *         - title
 *         - description
 *         - orgUnitId
 *         - technicianId
 *         - statusId
 *         - openDate
 *         - closeDate
 *         - referenceExternal
 *         - createdAt
 *         - createdBy
 *         - updatedAt
 *         - updatedBy
 *         - isDeleted
 *         - deletedAt
 *         - deletedBy
 *
 *     PaginatedCaseFileResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de expedientes que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/CaseFileResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de expedientes que cumplen el filtro.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página actual.
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de expedientes por página.
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *
 *     CreateCaseFileResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la creación del expediente.
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente recién creado.
 *       required:
 *         - message
 *         - caseId
 *
 *     CreateCaseFileDto:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Código único para el expediente.
 *           example: EXP-2025-0001
 *         title:
 *           type: string
 *           description: Título o asunto principal del expediente.
 *           example: "Demanda de pensión alimenticia"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción detallada del expediente.
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador de la unidad organizacional asociada.
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Identificador del técnico o responsable asignado.
 *         statusId:
 *           type: integer
 *           format: int32
 *           description: Identificador del estado inicial del expediente.
 *         openDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de apertura del expediente.
 *         referenceExternal:
 *           type: string
 *           nullable: true
 *           description: Referencia externa asociada al expediente, si aplica.
 *       required:
 *         - code
 *         - title
 *         - technicianId
 *         - statusId
 *         - openDate
 *
 *     UpdateCaseFileDto:
 *       type: object
 *       description: Campos editables del expediente. Todos los campos son opcionales.
 *       properties:
 *         code:
 *           type: string
 *           description: Nuevo código del expediente.
 *         title:
 *           type: string
 *           description: Nuevo título o asunto principal del expediente.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Nueva descripción del expediente.
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Nueva unidad organizacional asociada.
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Nuevo técnico o responsable asignado.
 *         statusId:
 *           type: integer
 *           format: int32
 *           description: Nuevo estado del expediente.
 *         openDate:
 *           type: string
 *           format: date-time
 *           description: Nueva fecha de apertura del expediente.
 *         closeDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de cierre del expediente.
 *         referenceExternal:
 *           type: string
 *           nullable: true
 *           description: Nueva referencia externa asociada.
 *       required: []
 *
 *     CaseFileQueryDto:
 *       type: object
 *       description: Filtros opcionales para la búsqueda y paginación de expedientes.
 *       properties:
 *         search:
 *           type: string
 *           description: Texto de búsqueda para filtrar por código, título o descripción.
 *           example: "pensión"
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           description: Identificador de la unidad organizacional para filtrar expedientes.
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Identificador del técnico o responsable para filtrar expedientes.
 *         statusId:
 *           type: integer
 *           format: int32
 *           description: Identificador del estado para filtrar expedientes.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de expedientes por página.
 *           example: 20
 *           default: 20
 *       required: []
 *
 *     ChangeCaseStatusDto:
 *       type: object
 *       description: Información requerida para cambiar el estado de un expediente.
 *       properties:
 *         statusId:
 *           type: integer
 *           format: int32
 *           description: Identificador del nuevo estado objetivo del expediente.
 *       required:
 *         - statusId
 *
 *     CaseFileIdParamDto:
 *       type: object
 *       description: Parámetros de ruta para identificar un expediente específico.
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador numérico del expediente.
 *       required:
 *         - id
 */

// Swagger components

/**
 * @openapi
 * components:
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
 *     CaseReviewResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único de la revisión de expediente.
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente asociado a la revisión.
 *         reviewerId:
 *           type: integer
 *           format: int32
 *           description: Identificador del revisor que realizó la revisión.
 *         previousStatusId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del estado previo del expediente antes de la revisión, si aplica.
 *         newStatusId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del nuevo estado del expediente después de la revisión, si aplica.
 *         comment:
 *           type: string
 *           nullable: true
 *           description: Comentario o nota registrada por el revisor.
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora en que se realizó la revisión.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro de revisión.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el registro de revisión.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización del registro de revisión.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si la revisión ha sido eliminada lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico de la revisión.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico.
 *       required:
 *         - id
 *         - caseId
 *         - reviewerId
 *         - previousStatusId
 *         - newStatusId
 *         - comment
 *         - reviewedAt
 *         - createdAt
 *         - createdBy
 *         - updatedAt
 *         - updatedBy
 *         - isDeleted
 *         - deletedAt
 *         - deletedBy
 *
 *     PaginatedCaseReviewResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de revisiones que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/CaseReviewResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de revisiones que cumplen el filtro.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página actual.
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de revisiones por página.
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *
 *     CreateCaseReviewResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado del registro de la revisión.
 *         reviewId:
 *           type: integer
 *           format: int32
 *           description: Identificador de la revisión recién registrada.
 *       required:
 *         - message
 *         - reviewId
 *
 *     CreateCaseReviewDto:
 *       type: object
 *       properties:
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente que se está revisando.
 *           example: 123
 *         previousStatusId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Estado previo del expediente antes de la revisión, si aplica.
 *           example: 1
 *         newStatusId:
 *           type: integer
 *           format: int32
 *           description: Nuevo estado que se desea asignar al expediente.
 *           example: 2
 *         comment:
 *           type: string
 *           nullable: true
 *           description: Comentario u observaciones de la revisión.
 *           example: "Se actualiza el estado tras la revisión de documentos."
 *       required:
 *         - caseId
 *         - newStatusId
 *
 *     CaseReviewQueryDto:
 *       type: object
 *       description: Filtros opcionales para la búsqueda y paginación de revisiones de un expediente.
 *       properties:
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente cuyas revisiones se desean consultar.
 *           example: 123
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de revisiones por página.
 *           example: 20
 *           default: 20
 *       required:
 *         - caseId
 */

// Swagger components

/**
 * @openapi
 * components:
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
 *     CaseStatusResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único del estado de expediente.
 *         code:
 *           type: string
 *           description: Código único del estado de expediente.
 *         name:
 *           type: string
 *           description: Nombre legible del estado de expediente.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción detallada del estado de expediente.
 *         isFinal:
 *           type: boolean
 *           description: Indica si el estado es un estado final en el flujo del expediente.
 *         order:
 *           type: integer
 *           format: int32
 *           description: Orden relativo del estado dentro del flujo.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del estado de expediente.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización del estado de expediente.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si el estado de expediente ha sido eliminado lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico del estado de expediente.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico.
 *       required:
 *         - id
 *         - code
 *         - name
 *         - description
 *         - isFinal
 *         - order
 *         - createdAt
 *         - createdBy
 *         - updatedAt
 *         - updatedBy
 *         - isDeleted
 *         - deletedAt
 *         - deletedBy
 *
 *     ListCaseStatusResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de estados de expediente que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/CaseStatusResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de estados de expediente que cumplen el filtro.
 *       required:
 *         - items
 *         - total
 *
 *     CreateCaseStatusResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la creación del estado de expediente.
 *         statusId:
 *           type: integer
 *           format: int32
 *           description: Identificador del estado de expediente recién creado.
 *       required:
 *         - message
 *         - statusId
 *
 *     CreateCaseStatusDto:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: Código único del estado de expediente.
 *           example: "ABIERTO"
 *         name:
 *           type: string
 *           description: Nombre legible del estado de expediente.
 *           example: "Abierto"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción opcional del estado de expediente.
 *           example: "Expediente recién ingresado y pendiente de revisión."
 *         isFinal:
 *           type: boolean
 *           description: Indica si el estado es final en el flujo del expediente.
 *           example: false
 *         order:
 *           type: integer
 *           format: int32
 *           description: Orden relativo del estado dentro del flujo.
 *           example: 1
 *       required:
 *         - code
 *         - name
 *         - isFinal
 *         - order
 *
 *     UpdateCaseStatusDto:
 *       type: object
 *       description: Campos editables del estado de expediente. Todos los campos son opcionales.
 *       properties:
 *         code:
 *           type: string
 *           description: Nuevo código único del estado de expediente.
 *         name:
 *           type: string
 *           description: Nuevo nombre legible del estado de expediente.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Nueva descripción del estado de expediente.
 *         isFinal:
 *           type: boolean
 *           description: Indica si el estado debe marcarse o no como final.
 *         order:
 *           type: integer
 *           format: int32
 *           description: Nuevo orden relativo del estado dentro del flujo.
 *       required: []
 *
 *     CaseStatusQueryDto:
 *       type: object
 *       description: Filtros opcionales para la consulta del catálogo de estados de expediente.
 *       properties:
 *         search:
 *           type: string
 *           description: Texto de búsqueda para filtrar por código o nombre del estado.
 *           example: "ABIERTO"
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de registros por página.
 *           example: 20
 *           default: 20
 *       required: []
 *
 *     CaseStatusIdParamDto:
 *       type: object
 *       description: Parámetros de ruta para identificar un estado de expediente específico.
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador numérico del estado de expediente.
 *       required:
 *         - id
 */

// Swagger components

/**
 * @openapi
 * components:
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
 *     EvidenceResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único de la evidencia.
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente al que está asociada la evidencia.
 *         sequenceNumber:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Número de secuencia de la evidencia dentro del expediente.
 *         description:
 *           type: string
 *           description: Descripción principal de la evidencia.
 *         color:
 *           type: string
 *           nullable: true
 *           description: Color descriptivo de la evidencia, si aplica.
 *         sizeText:
 *           type: string
 *           nullable: true
 *           description: Descripción del tamaño o dimensiones de la evidencia.
 *         weightValue:
 *           type: number
 *           format: double
 *           nullable: true
 *           description: Valor numérico del peso de la evidencia.
 *         weightUnit:
 *           type: string
 *           nullable: true
 *           description: Unidad de medida utilizada para el peso de la evidencia.
 *         location:
 *           type: string
 *           nullable: true
 *           description: Ubicación de la evidencia (lugar de hallazgo o resguardo).
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Identificador del técnico o responsable asociado a la evidencia.
 *         observations:
 *           type: string
 *           nullable: true
 *           description: Observaciones adicionales sobre la evidencia.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro de evidencia.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el registro de evidencia.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización de la evidencia.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si la evidencia ha sido eliminada lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico de la evidencia.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico.
 *       required:
 *         - id
 *         - caseId
 *         - description
 *         - technicianId
 *         - createdAt
 *         - createdBy
 *         - isDeleted
 *
 *     PaginatedEvidenceResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de evidencias que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/EvidenceResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de evidencias que cumplen el filtro.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página actual.
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de evidencias por página.
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *
 *     CreateEvidenceResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado del registro de la evidencia.
 *         evidenceId:
 *           type: integer
 *           format: int32
 *           description: Identificador de la evidencia recién registrada.
 *       required:
 *         - message
 *         - evidenceId
 *
 *     CreateEvidenceDto:
 *       type: object
 *       properties:
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente al que se asociará la evidencia.
 *           example: 123
 *         sequenceNumber:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Número de secuencia de la evidencia dentro del expediente.
 *           example: 1
 *         description:
 *           type: string
 *           description: Descripción principal de la evidencia.
 *           example: "Cuchillo con manchas de posible sustancia hemática."
 *         color:
 *           type: string
 *           nullable: true
 *           description: Color descriptivo de la evidencia.
 *           example: "Plateado"
 *         sizeText:
 *           type: string
 *           nullable: true
 *           description: Descripción del tamaño o dimensiones de la evidencia.
 *           example: "Aproximadamente 20 cm de longitud."
 *         weightValue:
 *           type: number
 *           format: double
 *           nullable: true
 *           description: Peso aproximado de la evidencia.
 *           example: 0.5
 *         weightUnit:
 *           type: string
 *           nullable: true
 *           description: Unidad de medida utilizada para el peso.
 *           example: "kg"
 *         location:
 *           type: string
 *           nullable: true
 *           description: Ubicación de hallazgo o resguardo de la evidencia.
 *           example: "Dormitorio principal"
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Identificador del técnico o responsable que registra la evidencia.
 *           example: 45
 *         observations:
 *           type: string
 *           nullable: true
 *           description: Observaciones adicionales relevantes sobre la evidencia.
 *           example: "Se embala en bolsa de papel y se etiqueta como evidencia 1."
 *       required:
 *         - caseId
 *         - description
 *         - technicianId
 *
 *     UpdateEvidenceDto:
 *       type: object
 *       description: Campos editables de una evidencia. Todos los campos son opcionales.
 *       properties:
 *         sequenceNumber:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Nuevo número de secuencia de la evidencia.
 *         description:
 *           type: string
 *           description: Nueva descripción principal de la evidencia.
 *         color:
 *           type: string
 *           nullable: true
 *           description: Nuevo color descriptivo de la evidencia.
 *         sizeText:
 *           type: string
 *           nullable: true
 *           description: Nueva descripción de tamaño o dimensiones.
 *         weightValue:
 *           type: number
 *           format: double
 *           nullable: true
 *           description: Nuevo valor de peso de la evidencia.
 *         weightUnit:
 *           type: string
 *           nullable: true
 *           description: Nueva unidad de medida utilizada para el peso.
 *         location:
 *           type: string
 *           nullable: true
 *           description: Nueva ubicación de la evidencia.
 *         technicianId:
 *           type: integer
 *           format: int32
 *           description: Nuevo técnico o responsable asociado a la evidencia.
 *         observations:
 *           type: string
 *           nullable: true
 *           description: Nuevas observaciones adicionales sobre la evidencia.
 *       required: []
 *
 *     EvidenceQueryDto:
 *       type: object
 *       description: Filtros opcionales para la búsqueda y paginación de evidencias de un expediente.
 *       properties:
 *         caseId:
 *           type: integer
 *           format: int32
 *           description: Identificador del expediente cuyas evidencias se desean consultar.
 *           example: 123
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de evidencias por página.
 *           example: 20
 *           default: 20
 *       required:
 *         - caseId
 *
 *     EvidenceIdParamDto:
 *       type: object
 *       description: Parámetros de ruta para identificar una evidencia específica.
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador numérico de la evidencia.
 *       required:
 *         - id
 */
// Swagger components

/**
 * @openapi
 * components:
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
 *     OrgUnitResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único de la unidad organizacional.
 *         parentId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador de la unidad organizacional padre, si aplica.
 *         code:
 *           type: string
 *           description: Código único de la unidad organizacional.
 *         name:
 *           type: string
 *           description: Nombre legible de la unidad organizacional.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción detallada de la unidad organizacional.
 *         isActive:
 *           type: boolean
 *           description: Indica si la unidad organizacional está activa.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación de la unidad organizacional.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización de la unidad organizacional.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si la unidad organizacional ha sido eliminada lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico de la unidad organizacional.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico.
 *       required:
 *         - id
 *         - parentId
 *         - code
 *         - name
 *         - description
 *         - isActive
 *         - createdAt
 *         - createdBy
 *         - updatedAt
 *         - updatedBy
 *         - isDeleted
 *         - deletedAt
 *         - deletedBy
 *
 *     PaginatedOrgUnitResponseDto:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           description: Listado de unidades organizacionales que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/OrgUnitResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de unidades organizacionales que cumplen el filtro.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página actual.
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de unidades organizacionales por página.
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *
 *     CreateOrgUnitResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la creación de la unidad organizacional.
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           description: Identificador de la unidad organizacional recién creada.
 *       required:
 *         - message
 *         - orgUnitId
 *
 *     CreateOrgUnitDto:
 *       type: object
 *       properties:
 *         parentId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador de la unidad organizacional padre, si aplica.
 *           example: 10
 *         code:
 *           type: string
 *           description: Código único de la unidad organizacional.
 *           example: "UNI-JUR-01"
 *         name:
 *           type: string
 *           description: Nombre de la nueva unidad organizacional.
 *           example: "Unidad Jurídica"
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descripción opcional de la unidad organizacional.
 *           example: "Unidad encargada de la gestión jurídica de los expedientes."
 *         isActive:
 *           type: boolean
 *           description: Indica si la unidad organizacional se crea como activa.
 *           example: true
 *       required:
 *         - code
 *         - name
 *
 *     UpdateOrgUnitDto:
 *       type: object
 *       description: Campos editables de una unidad organizacional. Todos los campos son opcionales.
 *       properties:
 *         parentId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Nuevo identificador de la unidad organizacional padre, si aplica.
 *         code:
 *           type: string
 *           description: Nuevo código único de la unidad organizacional.
 *         name:
 *           type: string
 *           description: Nuevo nombre de la unidad organizacional.
 *         description:
 *           type: string
 *           nullable: true
 *           description: Nueva descripción de la unidad organizacional.
 *         isActive:
 *           type: boolean
 *           description: Indica si la unidad organizacional debe marcarse como activa o inactiva.
 *       required: []
 *
 *     OrgUnitQueryDto:
 *       type: object
 *       description: Filtros opcionales para la consulta paginada de unidades organizacionales.
 *       properties:
 *         search:
 *           type: string
 *           description: Texto de búsqueda para filtrar por código o nombre.
 *           example: "Jurídica"
 *         isActive:
 *           type: boolean
 *           description: Indica si se deben filtrar únicamente unidades activas o inactivas.
 *           example: true
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de unidades organizacionales por página.
 *           example: 20
 *           default: 20
 *       required: []
 *
 *     OrgUnitIdParamDto:
 *       type: object
 *       description: Parámetros de ruta para identificar una unidad organizacional específica.
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador numérico de la unidad organizacional.
 *       required:
 *         - id
 */
// Swagger components

/**
 * @openapi
 * components:
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
 *     UserResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador único del usuario.
 *         username:
 *           type: string
 *           description: Nombre de usuario utilizado para autenticación.
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario.
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario.
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador de la unidad organizacional a la que pertenece el usuario.
 *         isActive:
 *           type: boolean
 *           description: Indica si el usuario está activo.
 *         mustChangePassword:
 *           type: boolean
 *           description: Indica si el usuario debe cambiar su contraseña en el próximo inicio de sesión.
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del último inicio de sesión del usuario.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del usuario.
 *         createdBy:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario que creó el registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora de la última actualización del usuario.
 *         updatedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó la última actualización.
 *         isDeleted:
 *           type: boolean
 *           description: Indica si el usuario ha sido eliminado lógicamente.
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha y hora del borrado lógico del usuario.
 *         deletedBy:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Identificador del usuario que realizó el borrado lógico.
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
 *           description: Listado de usuarios que cumplen con los criterios de búsqueda.
 *           items:
 *             $ref: '#/components/schemas/UserResponseDto'
 *         total:
 *           type: integer
 *           format: int32
 *           description: Total de usuarios que cumplen el filtro.
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página actual.
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de usuarios por página.
 *       required:
 *         - items
 *         - total
 *         - page
 *         - limit
 *
 *     CreateUserResponseDto:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado de la creación del usuario.
 *         userId:
 *           type: integer
 *           format: int32
 *           description: Identificador del usuario recién creado.
 *       required:
 *         - message
 *         - userId
 *
 *     CreateUserDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario único para autenticación.
 *           example: "jdoe"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario.
 *           example: "jgomez@mp.com.gt"
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario.
 *           example: "John Doe"
 *         password:
 *           type: string
 *           description: Contraseña inicial del usuario.
 *           example: "P@ssw0rd!"
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Unidad organizacional a la que pertenece el usuario.
 *           example: 5
 *         isActive:
 *           type: boolean
 *           description: Indica si el usuario se crea como activo.
 *           example: true
 *         mustChangePassword:
 *           type: boolean
 *           description: Indica si el usuario deberá cambiar la contraseña en el primer inicio de sesión.
 *           example: true
 *       required:
 *         - username
 *         - email
 *         - fullName
 *         - password
 *
 *     UpdateUserDto:
 *       type: object
 *       description: Campos editables de un usuario. Todos los campos son opcionales.
 *       properties:
 *         username:
 *           type: string
 *           description: Nuevo nombre de usuario.
 *         email:
 *           type: string
 *           format: email
 *           description: Nuevo correo electrónico del usuario.
 *         fullName:
 *           type: string
 *           description: Nuevo nombre completo del usuario.
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: Nueva unidad organizacional del usuario.
 *         isActive:
 *           type: boolean
 *           description: Indica si el usuario debe marcarse como activo o inactivo.
 *         mustChangePassword:
 *           type: boolean
 *           description: Indica si el usuario deberá cambiar su contraseña en el siguiente inicio de sesión.
 *       required: []
 *
 *     UserQueryDto:
 *       type: object
 *       description: Filtros opcionales para la búsqueda y paginación de usuarios.
 *       properties:
 *         search:
 *           type: string
 *           description: Texto de búsqueda para filtrar por usuario, nombre completo o correo.
 *           example: "john"
 *         orgUnitId:
 *           type: integer
 *           format: int32
 *           description: Identificador de la unidad organizacional para filtrar usuarios.
 *           example: 5
 *         isActive:
 *           type: boolean
 *           description: Filtrar usuarios activos o inactivos.
 *           example: true
 *         page:
 *           type: integer
 *           format: int32
 *           description: Número de página para paginación.
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           format: int32
 *           description: Cantidad máxima de usuarios por página.
 *           example: 20
 *           default: 20
 *       required: []
 *
 *     UpdateUserPasswordDto:
 *       type: object
 *       description: Datos necesarios para actualizar la contraseña de un usuario.
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Contraseña actual del usuario.
 *           example: "P@ssw0rd!"
 *         newPassword:
 *           type: string
 *           description: Nueva contraseña que se desea establecer.
 *           example: "N3wP@ssw0rd!"
 *         newPasswordConfirm:
 *           type: string
 *           description: Confirmación de la nueva contraseña; debe coincidir con newPassword.
 *           example: "N3wP@ssw0rd!"
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - newPasswordConfirm
 *
 *     UserIdParamDto:
 *       type: object
 *       description: Parámetros de ruta para identificar un usuario específico.
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Identificador numérico del usuario.
 *       required:
 *         - id
 */
// Swagger components

/**
 * @openapi
 * components:
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
 *     LoginDto:
 *       type: object
 *       description: Datos de autenticación requeridos para iniciar sesión.
 *       properties:
 *         usernameOrEmail:
 *           type: string
 *           description: Nombre de usuario o correo electrónico registrado en el sistema.
 *           minLength: 1
 *           maxLength: 150
 *           example: "juan.perez"
 *         password:
 *           type: string
 *           description: Contraseña en texto plano para autenticación.
 *           minLength: 1
 *           maxLength: 200
 *           example: "MiContraseñaSegura123"
 *       required:
 *         - usernameOrEmail
 *         - password
 *
 *     RefreshTokenDto:
 *       type: object
 *       description: Datos necesarios para refrescar el par de tokens JWT.
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Token de actualización emitido previamente por el sistema.
 *           minLength: 1
 *           maxLength: 1000
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcwMDk5OTk5OX0.abc123"
 *       required:
 *         - refreshToken
 *
 *     ChangePasswordDto:
 *       type: object
 *       description: Datos necesarios para cambiar la contraseña del usuario autenticado.
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Contraseña actual del usuario, utilizada para validar el cambio.
 *           minLength: 1
 *           maxLength: 200
 *           example: "MiContraseñaActual123"
 *         newPassword:
 *           type: string
 *           description: Nueva contraseña que se desea establecer para el usuario.
 *           minLength: 8
 *           maxLength: 200
 *           example: "MiNuevaContraseñaSegura456"
 *         confirmNewPassword:
 *           type: string
 *           description: Confirmación de la nueva contraseña; debe coincidir exactamente con newPassword.
 *           minLength: 8
 *           maxLength: 200
 *           example: "MiNuevaContraseñaSegura456"
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmNewPassword
 *
 *     LoginResponseDto:
 *       type: object
 *       description: Respuesta devuelta tras una autenticación exitosa.
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Token JWT de acceso que debe enviarse en la cabecera Authorization.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: Token JWT de actualización para obtener nuevos tokens de acceso.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         tokenType:
 *           type: string
 *           description: Tipo de token utilizado en la cabecera de autenticación.
 *           example: "Bearer"
 *         expiresIn:
 *           type: integer
 *           format: int32
 *           description: Tiempo en segundos hasta la expiración del token de acceso.
 *           example: 3600
 *         user:
 *           $ref: '#/components/schemas/UserResponseDto'
 *       required:
 *         - accessToken
 *         - refreshToken
 *         - tokenType
 *         - expiresIn
 *         - user
 *
 *     RefreshTokenResponseDto:
 *       type: object
 *       description: Respuesta devuelta al refrescar un par de tokens JWT.
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Nuevo token JWT de acceso.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: Nuevo token JWT de actualización.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         tokenType:
 *           type: string
 *           description: Tipo de token utilizado en la cabecera de autenticación.
 *           example: "Bearer"
 *         expiresIn:
 *           type: integer
 *           format: int32
 *           description: Tiempo en segundos hasta la expiración del nuevo token de acceso.
 *           example: 3600
 *       required:
 *         - accessToken
 *         - refreshToken
 *         - tokenType
 *         - expiresIn
 */
