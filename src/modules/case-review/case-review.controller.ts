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
  import { CaseReviewService } from './case-review.service';
  import { CreateCaseReviewDto } from './dto/create-case-review.dto';
  import { CaseReviewQueryDto } from './dto/query-case-rewiew.dto';
  
  class CaseReviewResponseDto {
    id!: number;
    caseId!: number;
    reviewerId!: number;
    previousStatusId!: number | null;
    newStatusId!: number | null;
    comment!: string | null;
    reviewedAt!: string;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class PaginatedCaseReviewResponseDto {
    items!: CaseReviewResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateCaseReviewResponseDto extends GenericMessageResponseDto {
    reviewId!: number;
  }
  
  @ApiTags('Revisiones de expedientes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('case-reviews')
  export class CaseReviewController {
    constructor(private readonly caseReviewService: CaseReviewService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Registrar una revisión de expediente',
      description:
        'Registra una nueva revisión de un expediente, almacenando el cambio de estado, comentario y datos del revisor.',
    })
    @ApiResponse({
      status: 201,
      description: 'Revisión registrada correctamente.',
      type: CreateCaseReviewResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos de la revisión.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El expediente asociado a la revisión no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'El nuevo estado es igual al estado anterior o la operación entra en conflicto con el estado actual.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar registrar la revisión.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateCaseReviewDto,
      @Req() req: Request,
    ): Promise<CreateCaseReviewResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseReviewService.registerReview(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar revisiones de un expediente',
      description:
        'Devuelve un listado paginado de revisiones asociadas a un expediente específico, identificado por su caseId.',
    })
    @ApiResponse({
      status: 200,
      description:
        'Listado de revisiones del expediente obtenido correctamente.',
      type: PaginatedCaseReviewResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Parámetros de consulta inválidos o falta el identificador del expediente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'No se encontraron revisiones para el expediente especificado o el expediente no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar listar las revisiones del expediente.',
      type: GenericMessageResponseDto,
    })
    async listByCase(
      @Query() query: CaseReviewQueryDto,
    ): Promise<PaginatedCaseReviewResponseDto> {
      return this.caseReviewService.listReviewsByCase(query);
    }
  }
  