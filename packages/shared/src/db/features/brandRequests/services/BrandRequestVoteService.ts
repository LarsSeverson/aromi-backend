import type { DataSources } from '@src/datasources/index.js'
import type { Kysely, SelectQueryBuilder, ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error.js'
import type { VoteInfoRow, BrandRequestVoteRow, DB } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'

export class BrandRequestVoteService extends TableService<'brandRequestVotes', BrandRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'brandRequestVotes')
  }

  findVoteInfo (
    where?: ExpressionOrFactory<DB, 'brandRequestVotes', SqlBool>,
    userId?: string | null
  ): ResultAsync<VoteInfoRow[], ApiError> {
    let query = this.buildVoteQuery(this.Table.connection, userId)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query
          .groupBy('requestId')
          .execute(),
        error => ApiError.fromDatabase(error)
      )
  }

  findOneVoteInfo (
    where?: ExpressionOrFactory<DB, 'brandRequestVotes', SqlBool>,
    userId?: string | null
  ): ResultAsync<VoteInfoRow, ApiError> {
    let query = this.buildVoteQuery(this.Table.connection, userId)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
  }

  private buildVoteQuery (
    conn: Kysely<DB>,
    userId?: string | null
  ): SelectQueryBuilder<DB, 'brandRequestVotes', VoteInfoRow> {
    return conn
      .selectFrom('brandRequestVotes')
      .select(eb => [
        eb
          .ref('requestId')
          .as('targetId'),
        eb
          .fn
          .sum<number>(eb.case().when('vote', '=', 1)
            .then(1)
            .else(0)
            .end())
          .as('upvotes'),
        eb
          .fn
          .sum<number>(eb.case().when('vote', '=', -1)
            .then(1)
            .else(0)
            .end())
          .as('downvotes'),
        eb
          .fn
          .coalesce(eb.fn.coalesce(eb.fn.sum<number>('vote'), eb.lit(0)))
          .as('score'),
        userId != null
          ? eb
            .fn
            .max(eb.case().when('userId', '=', userId)
              .then(eb.ref('vote'))
              .else(0)
              .end())
            .as('userVote')
          : eb
            .val(null)
            .as('userVote')
      ])
  }
}
