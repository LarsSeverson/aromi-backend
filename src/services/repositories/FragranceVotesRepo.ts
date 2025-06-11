import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'

export type FragranceVoteRow = Selectable<DB['fragranceVotes']>

export class FragranceVotesRepo extends TableService<'fragranceVotes', FragranceVoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceVotes')
  }

  create (
    values: Pick<FragranceVoteRow, 'fragranceId' | 'userId' | 'vote' | 'deletedAt'>
  ): ResultAsync<FragranceVoteRow, ApiError> {
    const { vote, deletedAt } = values

    return ResultAsync
      .fromPromise(
        this
          .Table
          .create(
            values,
            (qb) => qb
              .onConflict(c =>
                c
                  .columns(['fragranceId', 'userId'])
                  .doUpdateSet({ vote, deletedAt })
              )
          )
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
