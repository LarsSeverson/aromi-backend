import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type DB } from '@src/db/schema'
import { type ApiDataSources } from '@src/datasources/datasources'

export type ReviewVoteRow = Selectable<DB['fragranceReviewVotes']>

export class ReviewVotesRepo extends TableService<'fragranceReviewVotes', ReviewVoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceReviewVotes')
  }
}
