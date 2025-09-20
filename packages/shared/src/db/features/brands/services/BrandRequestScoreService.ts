import { TableService } from '@src/db/services/TableService.js'
import type { BrandRequestScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class BrandRequestScoreService extends TableService<BrandRequestScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestScores')
  }
}