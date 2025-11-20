/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *         orgUnitId:
 *           type: integer
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         mustChangePassword:
 *           type: boolean
 *       required:
 *         - username
 *         - password
 *         - email
 *         - fullName
 */
