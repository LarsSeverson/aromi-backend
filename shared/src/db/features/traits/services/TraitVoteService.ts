import { type DataSources } from '@src/datasources'
import { TableService } from '@src/db/services/TableService'
import { type TraitVoteRow } from '../types'

export class TraitVoteService extends TableService<'traitVotes', TraitVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'traitVotes')
  }
}
