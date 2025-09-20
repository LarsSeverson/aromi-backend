import { TableService } from '@src/db/services/TableService.js'
import type { FragranceRequestScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceRequestScoreService extends TableService<FragranceRequestScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestScores')
  }
}