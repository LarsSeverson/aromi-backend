import { TableService } from '@src/db/services/TableService.js'
import type { FragranceTraitScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceTraitScoreService extends TableService<FragranceTraitScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceTraitScores')
  }
}