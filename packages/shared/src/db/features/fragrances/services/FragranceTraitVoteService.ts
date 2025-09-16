import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { AggFragranceTraitVoteRow, FragranceTraitVoteRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import type { SqlBool, ExpressionOrFactory } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'

export class FragranceTraitVoteService extends FeaturedTableService<FragranceTraitVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceTraitVotes')
  }

  findVotesAgg (
    where?: ExpressionOrFactory<DB, 'fragranceTraitVotes', SqlBool>
  ): ResultAsync<AggFragranceTraitVoteRow[], BackendError> {
    let query = this
      .db
      .selectFrom('fragranceTraitVotes')
      .select([
        'fragranceTraitVotes.fragranceId',
        'fragranceTraitVotes.traitOptionId',
        this.db.fn.countAll<number>().as('votes')
      ])
      .where('fragranceTraitVotes.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    query = query.groupBy(['fragranceTraitVotes.fragranceId', 'fragranceTraitVotes.traitOptionId'])

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }
}