import { Logger } from '@nestjs/common';
import { CaseStatusSummaryQueryDto } from '../reports/dto/case-status-summary-query.dto';
import { CaseStatusSummaryRowDto } from '../reports/dto/case-status-summary-row.dto';
import { DomainError } from '../common/domain-error';
import { CaseFileRepository } from '../case-file/case-file.repository';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly caseFileRepository: CaseFileRepository) {}

  async caseStatusSummary(query: CaseStatusSummaryQueryDto): Promise<CaseStatusSummaryRowDto[]> {
    try {
      const rawRows = await this.caseFileRepository.list(query as any);

      const cases = rawRows
        .map((row) => this.mapDbCaseToResponse(row))
        .filter((cas) => this.filterCaseForSummary(cas, query));

      const summaryMap = new Map<number | null, CaseStatusSummaryRowDto>();

      for (const cas of cases) {
        const orgUnitId: number | null = cas.orgUnitId ?? null;
        const key = orgUnitId ?? 0;

        const orgUnitName: string =
          (cas as any).orgUnitName ??
          (orgUnitId !== null ? `Dependencia ${orgUnitId}` : 'Sin dependencia');

        let aggregate = summaryMap.get(key);

        if (!aggregate) {
          aggregate = {
            orgUnitId,
            orgUnitName,
            open: 0,
            inProgress: 0,
            closed: 0,
            total: 0,
          };
          summaryMap.set(key, aggregate);
        }

        if (this.matchesStatusGroup('OPEN', cas.statusId)) {
          aggregate.open++;
        } else if (this.matchesStatusGroup('IN_PROGRESS', cas.statusId)) {
          aggregate.inProgress++;
        } else if (this.matchesStatusGroup('CLOSED', cas.statusId)) {
          aggregate.closed++;
        }

        aggregate.total++;
      }

      return Array.from(summaryMap.values()).sort((a, b) =>
        a.orgUnitName.localeCompare(b.orgUnitName)
      );
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al generar el resumen de estados de expedientes. SP: usp_CaseFile_List',
        error
      );
    }
  }

  // =========================
  // EXCEL
  // =========================
  async exportCaseStatusSummaryExcel(query: CaseStatusSummaryQueryDto): Promise<Buffer> {
    try {
      const summary = await this.caseStatusSummary(query);

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Resumen');

      // Título
      sheet.mergeCells('A1:E1');
      sheet.getCell('A1').value = 'Resumen de expedientes por dependencia y estado';
      sheet.getCell('A1').font = { bold: true, size: 14 };

      sheet.mergeCells('A2:E2');
      sheet.getCell('A2').value = `Filtros: ${this.buildFiltersLabel(query)}`;
      sheet.getCell('A2').font = { size: 10 };

      // Encabezados
      sheet.addRow([]);
      const headerRow = sheet.addRow([
        'Dependencia',
        'Abiertos',
        'En trámite',
        'Cerrados',
        'Total',
      ]);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Datos
      for (const row of summary) {
        sheet.addRow([row.orgUnitName, row.open, row.inProgress, row.closed, row.total]);
      }

      sheet.columns = [
        { key: 'orgUnitName', width: 40 },
        { key: 'open', width: 12 },
        { key: 'inProgress', width: 12 },
        { key: 'closed', width: 12 },
        { key: 'total', width: 12 },
      ];

      const arrayBuffer = (await workbook.xlsx.writeBuffer()) as ArrayBuffer;
      return Buffer.from(arrayBuffer);
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al generar el Excel de resumen de expedientes.',
        error
      );
    }
  }

  // =========================
  // PDF
  // =========================
  async exportCaseStatusSummaryPdf(query: CaseStatusSummaryQueryDto): Promise<Buffer> {
    try {
      const summary = await this.caseStatusSummary(query);

      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Buffer[] = [];

      return await new Promise<Buffer>((resolve, reject) => {
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Encabezado
        doc.fontSize(14).text('Reporte de expedientes por dependencia y estado', {
          align: 'left',
        });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Filtros: ${this.buildFiltersLabel(query)}`);
        doc.moveDown();

        // Encabezados tabla
        const colX = { dep: 40, open: 260, inProg: 330, closed: 410, total: 490 };
        const startY = doc.y;

        doc.fontSize(11).text('Dependencia', colX.dep, startY);
        doc.text('Abiertos', colX.open, startY);
        doc.text('En trámite', colX.inProg, startY);
        doc.text('Cerrados', colX.closed, startY);
        doc.text('Total', colX.total, startY);

        doc
          .moveTo(40, startY + 14)
          .lineTo(550, startY + 14)
          .stroke();
        doc.moveDown(1);

        // Filas
        let currentY = startY + 20;
        doc.fontSize(9);

        summary.forEach((row) => {
          if (currentY > 770) {
            doc.addPage();
            currentY = 40;
          }

          doc.text(row.orgUnitName, colX.dep, currentY, {
            width: 210,
            ellipsis: true,
          });
          doc.text(String(row.open), colX.open, currentY);
          doc.text(String(row.inProgress), colX.inProg, currentY);
          doc.text(String(row.closed), colX.closed, currentY);
          doc.text(String(row.total), colX.total, currentY);

          currentY += 14;
        });

        doc.end();
      });
    } catch (error) {
      this.handleUnexpectedError(
        'Error técnico al generar el PDF de resumen de expedientes.',
        error
      );
    }
  }

  // =========================
  // HELPERS
  // =========================

  private buildFiltersLabel(query: CaseStatusSummaryQueryDto): string {
    const parts: string[] = [];

    if (query.orgUnitId) parts.push(`Dependencia: ${query.orgUnitId}`);
    if (query.status) {
      const label =
        query.status === 'OPEN'
          ? 'Abiertos'
          : query.status === 'IN_PROGRESS'
          ? 'En trámite'
          : 'Cerrados';
      parts.push(`Estado: ${label}`);
    }
    if (query.fromDate) parts.push(`Desde: ${query.fromDate}`);
    if (query.toDate) parts.push(`Hasta: ${query.toDate}`);

    return parts.length > 0 ? parts.join(' | ') : 'Sin filtros aplicados';
  }

  private filterCaseForSummary(cas: any, query: CaseStatusSummaryQueryDto): boolean {
    if (query.orgUnitId && cas.orgUnitId !== query.orgUnitId) {
      return false;
    }

    if (query.status && !this.matchesStatusGroup(query.status, cas.statusId as number)) {
      return false;
    }

    if (query.fromDate || query.toDate) {
      if (!this.isInDateRange(cas.openDate, query.fromDate, query.toDate)) {
        return false;
      }
    }

    return true;
  }

  private matchesStatusGroup(
    statusGroup: 'OPEN' | 'IN_PROGRESS' | 'CLOSED',
    statusId: number
  ): boolean {
    switch (statusGroup) {
      case 'OPEN':
        return statusId === 0;
      case 'IN_PROGRESS':
        return statusId === 1;
      case 'CLOSED':
        return statusId === 2 || statusId === 3;
      default:
        return true;
    }
  }

  private isInDateRange(
    value: string | Date | null | undefined,
    fromDate?: string,
    toDate?: string
  ): boolean {
    if (!fromDate && !toDate) return true;
    if (!value) return false;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      if (date < from) return false;
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (date > to) return false;
    }

    return true;
  }

  private handleUnexpectedError(message: string, error: unknown): never {
    this.logger.error(message, error instanceof Error ? error.stack : undefined);
    throw new DomainError('Error técnico al procesar la operación.', message, 500);
  }

  private mapDbCaseToResponse(row: any): any {
    return {
      id: row.cas_id ?? row.id ?? null,
      code: row.cas_code ?? row.code ?? null,
      title: row.cas_title ?? row.title ?? null,
      description: row.cas_description ?? row.description ?? null,

      orgUnitId: row.cas_org_unit_id ?? row.orgUnitId ?? null,
      orgUnitName: row.orgUnitName ?? null,

      technicianId: row.cas_technician_id ?? row.technicianId ?? null,

      statusId: row.cas_status_id ?? row.statusId ?? null,
      statusName: row.statusName ?? null,
      statusCode: row.statusCode ?? null,

      openDate: row.cas_open_date ?? row.openDate ?? null,
      closeDate: row.cas_close_date ?? row.closeDate ?? null,

      referenceExternal: row.cas_reference_external ?? row.referenceExternal ?? null,

      createdAt: row.cas_created_at ?? row.createdAt ?? null,
      createdBy: row.cas_created_by ?? row.createdBy ?? null,

      updatedAt: row.cas_updated_at ?? row.updatedAt ?? null,
      updatedBy: row.cas_updated_by ?? row.updatedBy ?? null,

      isDeleted: row.cas_is_deleted ?? row.isDeleted ?? false,
      deletedAt: row.cas_deleted_at ?? row.deletedAt ?? null,
      deletedBy: row.cas_deleted_by ?? row.deletedBy ?? null,
    };
  }
}
