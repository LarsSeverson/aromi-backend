import { TableService } from '@src/db/index.js'
import type { AccordRequestScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class AccordRequestScoreService extends TableService<AccordRequestScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestScores')
  }
}