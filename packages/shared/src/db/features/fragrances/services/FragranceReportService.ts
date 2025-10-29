import { TableService } from '@src/db/services/TableService.js'
import type { FragranceReportRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceReportService extends TableService<FragranceReportRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceReports')
  }
}