import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
  } from '@nestjs/swagger';
  import { Request } from 'express';
  
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UserRoleService } from './user-role.service';
  import { AssignUserRoleDto } from './dto/assign-user-role.dto';
  import { RemoveUserRoleDto } from './dto/remove-user-role.dto';
  import { UserRoleQueryDto } from './dto/query-user-role.dto';
  
  class UserRoleResponseDto {
    id!: number;
    userId!: number;
    roleId!: number;
    isPrimary!: boolean;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class PaginatedUserRoleResponseDto {
    items!: UserRoleResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  @ApiTags('Roles de usuario')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('user-roles')
  export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) {}
  
    @Post('assign')
    @ApiOperation({
      summary: 'Asignar un rol a un usuario',
      description:
        'Asigna un rol específico a un usuario, permitiendo marcarlo opcionalmente como rol principal.',
    })
    @ApiResponse({
      status: 201,
      description: 'Rol asignado correctamente al usuario.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o faltan identificadores válidos de usuario o rol.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'El usuario ya tiene asignado ese rol (violación de índice único).',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar asignar el rol al usuario.',
      type: GenericMessageResponseDto,
    })
    async assignRole(
      @Body() dto: AssignUserRoleDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.userRoleService.assignRole(dto, currentUserId);
    }
  
    @Post('remove')
    @ApiOperation({
      summary: 'Remover un rol de un usuario',
      description:
        'Remueve la asignación de un rol específico de un usuario determinado.',
    })
    @ApiResponse({
      status: 200,
      description: 'Rol removido correctamente del usuario.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o faltan identificadores válidos de usuario o rol.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'El rol no está asignado al usuario o ya fue removido previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar remover el rol del usuario.',
      type: GenericMessageResponseDto,
    })
    async removeRole(
      @Body() dto: RemoveUserRoleDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.userRoleService.removeRole(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar roles asignados a un usuario',
      description:
        'Devuelve un listado paginado de roles asignados a un usuario específico, identificado mediante parámetros de consulta.',
    })
    @ApiResponse({
      status: 200,
      description: 'Listado de roles del usuario obtenido correctamente.',
      type: PaginatedUserRoleResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Parámetros de consulta inválidos o falta el identificador del usuario.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar listar los roles del usuario.',
      type: GenericMessageResponseDto,
    })
    async listByUser(
      @Query() query: UserRoleQueryDto,
    ): Promise<PaginatedUserRoleResponseDto> {
      return this.userRoleService.listRolesByUser(query);
    }
  }
  