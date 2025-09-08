import { type DataSources } from '@src/datasources/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { type TraitVoteRow } from '../types.js'

export class TraitVoteService extends TableService<'traitVotes', TraitVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitVotes')
  }
}
