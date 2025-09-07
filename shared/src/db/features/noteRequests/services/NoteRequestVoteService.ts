import { type DataSources } from '@src/datasources'
import { type Kysely, type SelectQueryBuilder, type ExpressionOrFactory, type SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error'
import { type VoteInfoRow, type NoteRequestVoteRow } from '@src/db'
import { type DB } from '@src/db'
import { TableService } from '@src/db/services/TableService'

export class NoteRequestVoteService extends TableService<'noteRequestVotes', NoteRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestVotes')
  }

  findVoteInfo (
    where?: ExpressionOrFactory<DB, 'noteRequestVotes', SqlBool>,
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
    where?: ExpressionOrFactory<DB, 'noteRequestVotes', SqlBool>,
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
  ): SelectQueryBuilder<DB, 'noteRequestVotes', VoteInfoRow> {
    return conn
      .selectFrom('noteRequestVotes')
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
