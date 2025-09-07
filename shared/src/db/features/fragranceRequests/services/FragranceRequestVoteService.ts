import { type DataSources } from '@src/datasources'
import { type Kysely, type SelectQueryBuilder, type ExpressionOrFactory, type SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error'
import { type FragrnanceRequestRowWithVotes, type FragranceRequestVoteRow, type VoteInfoRow } from '@src/db'
import { type DB } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class FragranceRequestVoteService extends TableService<'fragranceRequestVotes', FragranceRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestVotes')
  }

  findRequests (
    where?: ExpressionOrFactory<DB, 'fragranceRequestVotes' | 'fragranceRequests', SqlBool>
  ): ResultAsync<FragrnanceRequestRowWithVotes[], ApiError> {
    let query = this
      .Table
      .connection
      .selectFrom('fragranceRequestVotes')
      .innerJoin('fragranceRequests', 'fragranceRequests.id', 'fragranceRequestVotes.requestId')
      .selectAll('fragranceRequests')
      .select(eb => eb
        .fn
        .sum<number>(eb.case().when('fragranceRequestVotes.vote', '=', 1).then(1).else(0).end())
        .as('upvotes')
      )

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query
          .groupBy('fragranceRequests.id')
          .execute(),
        error => ApiError.fromDatabase(error)
      )
  }

  findVoteInfo (
    where?: ExpressionOrFactory<DB, 'fragranceRequestVotes', SqlBool>,
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
    where?: ExpressionOrFactory<DB, 'fragranceRequestVotes', SqlBool>,
    userId?: string
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
  ): SelectQueryBuilder<DB, 'fragranceRequestVotes', VoteInfoRow> {
    return conn
      .selectFrom('fragranceRequestVotes')
      .select(eb => [
        eb
          .ref('requestId')
          .as('targetId'),
        eb
          .fn
          .sum<number>(eb.case().when('vote', '=', 1).then(1).else(0).end())
          .as('upvotes'),
        eb
          .fn
          .sum<number>(eb.case().when('vote', '=', -1).then(1).else(0).end())
          .as('downvotes'),
        eb
          .fn
          .coalesce(eb.fn.coalesce(eb.fn.sum<number>('vote'), eb.lit(0)))
          .as('score'),
        userId != null
          ? eb
            .fn
            .max(eb.case().when('userId', '=', userId).then(eb.ref('vote')).else(0).end())
            .as('userVote')
          : eb
            .val(null)
            .as('userVote')
      ])
  }
}
