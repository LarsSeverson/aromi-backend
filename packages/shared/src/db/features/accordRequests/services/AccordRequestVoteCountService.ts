import { TableService } from '@src/db/index.js'
import type { AccordRequestVoteCountRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class AccordRequestVoteCountService extends TableService<AccordRequestVoteCountRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestVoteCounts')
  }
}