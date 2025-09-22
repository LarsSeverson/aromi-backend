import { TableService } from '@src/db/services/TableService.js'
import type { FragranceScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceScoreService extends TableService<FragranceScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceScores')
  }
}