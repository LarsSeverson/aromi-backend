import { TableService } from '@src/services/TableService'
import { type DataSources } from '@src/datasources'
import { type ExpressionOrFactory, type SqlBool } from 'kysely'
import { type DB } from '@src/db/schema'
import { ResultAsync } from 'neverthrow'
import { type VoteInfoRow } from '@src/types/db-types'
import { ApiError } from '@src/common/error'
import { type NoteRequestVoteRow } from '../types'

export class NoteRequestVoteService extends TableService<'noteRequestVotes', NoteRequestVoteRow> {
  constructor (sources: DataSources) {
    super(sources, 'noteRequestVotes')
  }

  findVoteInfos (
    where?: ExpressionOrFactory<DB, 'noteRequestVotes', SqlBool>
  ): ResultAsync<VoteInfoRow[], ApiError> {
    const conn = this.Table.connection

    let query = conn
      .selectFrom('noteRequestVotes')
      .select(eb => [
        eb
          .ref('requestId')
          .as('targetId'),
        eb
          .fn
          .sum(eb.case().when('vote', '=', 1).then(1).else(0).end())
          .as('upvotes'),
        eb
          .fn
          .sum(eb.case().when('vote', '=', -1).then(1).else(0).end())
          .as('downvotes'),
        eb
          .fn
          .coalesce(eb.fn.coalesce(eb.fn.sum('vote'), eb.lit(0)))
          .as('score'),
        eb
          .fn
          .max('vote')
          .as('myVote')
      ])

    if (where != null) {
      query = query.where(where)
    }

    query = query.groupBy('requestId')

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error)
      )
      .map(rows => rows
        .map(row => ({
          targetId: row.targetId,
          upvotes: Number(row.upvotes ?? 0),
          downvotes: Number(row.downvotes ?? 0),
          score: Number(row.score ?? 0),
          myVote: row.myVote
        }))
      )
  }

  findVoteInfo (
    where?: ExpressionOrFactory<DB, 'noteRequestVotes', SqlBool>
  ): ResultAsync<VoteInfoRow, ApiError> {
    const conn = this.Table.connection

    let query = conn
      .selectFrom('noteRequestVotes')
      .select(eb => [
        eb
          .ref('requestId')
          .as('targetId'),
        eb
          .fn
          .sum(eb.case().when('vote', '=', 1).then(1).else(0).end())
          .as('upvotes'),
        eb
          .fn
          .sum(eb.case().when('vote', '=', -1).then(1).else(0).end())
          .as('downvotes'),
        eb
          .fn
          .coalesce(eb.fn.coalesce(eb.fn.sum('vote'), eb.lit(0)))
          .as('score'),
        eb
          .fn
          .max('vote')
          .as('myVote')
      ])

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error)
      )
      .map(row => ({
        targetId: row.targetId,
        upvotes: Number(row?.upvotes ?? 0),
        downvotes: Number(row?.downvotes ?? 0),
        score: Number(row?.score ?? 0),
        myVote: row?.myVote ?? null
      }))
  }
}
