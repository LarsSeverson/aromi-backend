import type { DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import type { FragranceRequestVoteRow } from '../types.js'

export class FragranceRequestVoteService extends TableService<FragranceRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestVotes')
  }
}
