import type { DataSources } from '@src/datasources/index.js'
import type { Kysely, SelectQueryBuilder, ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import { type VoteInfoRow, type NoteRequestVoteRow, type DB, TableService } from '@src/db/index.js'
import { NoteRequestVoteCountService } from './NoteRequestVoteCountService.js'

export class NoteRequestVoteService extends TableService<NoteRequestVoteRow> {
  counts: NoteRequestVoteCountService

  constructor (sources: DataSources) {
    super(sources, 'noteRequestVotes')
    this.counts = new NoteRequestVoteCountService(sources)
  }

  findVoteInfo (
    where?: ExpressionOrFactory<DB, 'noteRequestVotes', SqlBool>,
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
    where?: ExpressionOrFactory<DB, 'noteRequestVotes', SqlBool>,
    userId?: string | null
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
  ): SelectQueryBuilder<DB, 'noteRequestVotes', VoteInfoRow> {
    return conn
      .selectFrom('noteRequestVotes')
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
