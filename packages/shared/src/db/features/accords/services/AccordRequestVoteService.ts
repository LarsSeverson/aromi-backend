import type { DataSources } from '@src/datasources/index.js'
import type { AccordRequestVoteRow } from '../types.js'
import { TableService } from '@src/db/index.js'

export class AccordRequestVoteService extends TableService<AccordRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'accordRequestVotes')
  }
}
