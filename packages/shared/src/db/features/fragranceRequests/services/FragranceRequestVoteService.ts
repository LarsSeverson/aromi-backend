import type { DataSources } from '@src/datasources/index.js'
import type { Kysely, SelectQueryBuilder, ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import type { FragrnanceRequestRowWithVotes, FragranceRequestVoteRow, VoteInfoRow, DB } from '@src/db/index.js'
import { TableService } from '@src/db/services/TableService.js'
import { FragranceRequestVoteCountService } from './FragranceRequestVoteCountService.js'

export class FragranceRequestVoteService extends TableService<'fragranceRequestVotes', FragranceRequestVoteRow> {
  counts: FragranceRequestVoteCountService

  constructor (sources: DataSources) {
    super(sources, 'fragranceRequestVotes')
    this.counts = new FragranceRequestVoteCountService(sources)
  }

  findRequests (
    where?: ExpressionOrFactory<DB, 'fragranceRequestVotes' | 'fragranceRequests', SqlBool>
  ): ResultAsync<FragrnanceRequestRowWithVotes[], BackendError> {
    let query = this
      .Table
      .connection
      .selectFrom('fragranceRequestVotes')
      .innerJoin('fragranceRequests', 'fragranceRequests.id', 'fragranceRequestVotes.requestId')
      .selectAll('fragranceRequests')
      .select(eb => eb
        .fn
        .sum<number>(eb.case().when('fragranceRequestVotes.vote', '=', 1)
          .then(1)
          .else(0)
          .end())
        .as('upvotes'))

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query
          .groupBy('fragranceRequests.id')
          .execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  findVoteInfo (
    where?: ExpressionOrFactory<DB, 'fragranceRequestVotes', SqlBool>,
    userId?: string | null
  ): ResultAsync<VoteInfoRow[], BackendError> {
    let query = this.buildVoteQuery(this.Table.connection, userId)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query
          .groupBy('requestId')
          .execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  findOneVoteInfo (
    where?: ExpressionOrFactory<DB, 'fragranceRequestVotes', SqlBool>,
    userId?: string
  ): ResultAsync<VoteInfoRow, BackendError> {
    let query = this.buildVoteQuery(this.Table.connection, userId)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => BackendError.fromDatabase(error)
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
