import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type FragranceVoteRow = Selectable<DB['fragranceVotes']>

export class FragranceVotesRepo extends TableService<'fragranceVotes', FragranceVoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceVotes')
  }
}
