import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type TraitVoteRow = Selectable<DB['fragranceTraitVotes']>

export class TraitVotesRepo extends TableService<'fragranceTraitVotes', TraitVoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceTraitVotes')
  }
}
