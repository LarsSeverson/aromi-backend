import { TableService } from '@src/db/services/TableService.js'
import type { FragranceRequestVoteCountRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'

export class FragranceRequestVoteCountService extends TableService<'fragranceRequestVoteCounts', FragranceRequestVoteCountRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestVoteCounts')
  }
}