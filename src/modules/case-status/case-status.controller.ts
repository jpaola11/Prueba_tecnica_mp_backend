import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
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
  import { CaseStatusService } from './case-status.service';
  import { CreateCaseStatusDto } from './dto/create-case-status.dto';
  import { UpdateCaseStatusDto } from './dto/case-status.update.dto';
  import { IdParamDto } from '../../dto/helpers.dto';
  
  class CaseStatusResponseDto {
    id!: number;
    code!: string;
    name!: string;
    description!: string | null;
    isFinal!: boolean;
    order!: number;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class ListCaseStatusResponseDto {
    items!: CaseStatusResponseDto[];
    total!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateCaseStatusResponseDto extends GenericMessageResponseDto {
    statusId!: number;
  }
  
  @ApiTags('Estados de expedientes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('case-statuses')
  export class CaseStatusController {
    constructor(private readonly caseStatusService: CaseStatusService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Crear un nuevo estado de expediente',
      description:
        'Crea un nuevo estado de expediente en el catálogo, utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Estado de expediente creado correctamente.',
      type: CreateCaseStatusResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos del estado de expediente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe un estado de expediente con el mismo código (violación de índice único).',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar crear el estado de expediente.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateCaseStatusDto,
      @Req() req: Request,
    ): Promise<CreateCaseStatusResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseStatusService.createStatus(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar estados de expediente activos',
      description:
        'Devuelve el catálogo de estados de expediente activos, incluyendo información básica y metadatos de creación.',
    })
    @ApiResponse({
      status: 200,
      description: 'Listado de estados de expediente activos obtenido correctamente.',
      type: ListCaseStatusResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar listar los estados de expediente activos.',
      type: GenericMessageResponseDto,
    })
    async listActive(): Promise<ListCaseStatusResponseDto> {
      return this.caseStatusService.listActiveStatuses();
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Actualizar un estado de expediente',
      description:
        'Actualiza los datos de un estado de expediente existente identificado por su identificador numérico.',
    })
    @ApiResponse({
      status: 200,
      description: 'Estado de expediente actualizado correctamente.',
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
      description: 'El estado de expediente a actualizar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar actualizar el estado de expediente.',
      type: GenericMessageResponseDto,
    })
    async update(
      @Param() params: IdParamDto,
      @Body() dto: UpdateCaseStatusDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseStatusService.updateStatus(params.id, dto, currentUserId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar lógicamente un estado de expediente',
      description:
        'Realiza el borrado lógico de un estado de expediente, marcándolo como eliminado en el catálogo.',
    })
    @ApiResponse({
      status: 200,
      description: 'Estado de expediente eliminado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error al intentar eliminar el estado de expediente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'El estado de expediente no existe o ya fue eliminado previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar eliminar el estado de expediente.',
      type: GenericMessageResponseDto,
    })
    async softDelete(
      @Param() params: IdParamDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseStatusService.softDeleteStatus(params.id, currentUserId);
    }
  }
  