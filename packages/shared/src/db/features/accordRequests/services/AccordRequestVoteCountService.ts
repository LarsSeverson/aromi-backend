import { TableService } from '@src/db/services/TableService.js'
import type { AccordRequestVoteCountRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class AccordRequestVoteCountService extends TableService<'accordRequestVoteCounts', AccordRequestVoteCountRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestVoteCounts')
  }
}