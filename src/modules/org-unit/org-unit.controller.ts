import {
    Controller,
    Get,
    Post,
    Put,
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
  import { OrgUnitService } from './org-unit.service';
  import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
  import { UpdateOrgUnitDto } from './dto/org-unit.update.dto';
  import { OrgUnitQueryDto } from './dto/query-unit.dto';
  import { IdParamDto } from '../../dto/helpers.dto';
  
  class OrgUnitResponseDto {
    id!: number;
    parentId!: number | null;
    code!: string;
    name!: string;
    description!: string | null;
    isActive!: boolean;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class PaginatedOrgUnitResponseDto {
    items!: OrgUnitResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateOrgUnitResponseDto extends GenericMessageResponseDto {
    orgUnitId!: number;
  }
  
  @ApiTags('Unidades organizacionales')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('org-units')
  export class OrgUnitController {
    constructor(private readonly orgUnitService: OrgUnitService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Crear una unidad organizacional',
      description:
        'Crea una nueva unidad organizacional utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Unidad organizacional creada correctamente.',
      type: CreateOrgUnitResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos de la unidad organizacional.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe una unidad organizacional con el mismo código (violación de índice único).',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar crear la unidad organizacional.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateOrgUnitDto,
      @Req() req: Request,
    ): Promise<CreateOrgUnitResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.orgUnitService.createOrgUnit(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar unidades organizacionales activas',
      description:
        'Devuelve un listado paginado de unidades organizacionales activas según los parámetros de consulta proporcionados.',
    })
    @ApiResponse({
      status: 200,
      description:
        'Listado de unidades organizacionales obtenido correctamente.',
      type: PaginatedOrgUnitResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Parámetros de consulta inválidos o error en los filtros de búsqueda.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar listar las unidades organizacionales.',
      type: GenericMessageResponseDto,
    })
    async list(
      @Query() query: OrgUnitQueryDto,
    ): Promise<PaginatedOrgUnitResponseDto> {
      return this.orgUnitService.listOrgUnits(query);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Obtener detalle de una unidad organizacional',
      description:
        'Obtiene la información detallada de una unidad organizacional específica a partir de su identificador.',
    })
    @ApiResponse({
      status: 200,
      description: 'Unidad organizacional obtenida correctamente.',
      type: OrgUnitResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'La unidad organizacional solicitada no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar obtener la unidad organizacional.',
      type: GenericMessageResponseDto,
    })
    async getById(
      @Param() params: IdParamDto,
    ): Promise<OrgUnitResponseDto> {
      return this.orgUnitService.getOrgUnitById(params.id);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Actualizar una unidad organizacional',
      description:
        'Actualiza los datos de una unidad organizacional existente utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 200,
      description: 'Unidad organizacional actualizada correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos de actualización.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'La unidad organizacional a actualizar no existe o fue eliminada.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe una unidad organizacional con el mismo código (violación de índice único).',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar actualizar la unidad organizacional.',
      type: GenericMessageResponseDto,
    })
    async update(
      @Param() params: IdParamDto,
      @Body() dto: UpdateOrgUnitDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      const result = await this.orgUnitService.updateOrgUnit(
        params.id,
        dto,
        currentUserId,
      );
      return { message: result.message };
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar lógicamente una unidad organizacional',
      description:
        'Realiza el borrado lógico de una unidad organizacional, marcándola como eliminada sin removerla físicamente de la base de datos.',
    })
    @ApiResponse({
      status: 200,
      description: 'Unidad organizacional eliminada correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'La unidad organizacional no existe o ya fue eliminada previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar eliminar la unidad organizacional.',
      type: GenericMessageResponseDto,
    })
    async softDelete(
      @Param() params: IdParamDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.orgUnitService.softDeleteOrgUnit(params.id, currentUserId);
    }
  }
  