import { type NoteLayerEnum, type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService, type MyVote } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { NoteFillersRepo } from './NoteFillersRepo'
import { NoteVotesRepo } from './NoteVotesRepo'
import { ResultAsync } from 'neverthrow'
import { ApiError, throwError } from '@src/common/error'
import { VoteFactory } from '@src/factories/VoteFactory'

export interface FragranceNoteRow extends Selectable<DB['fragranceNotes']>, MyVote {
  noteId: number
  name: string
  s3Key: string | null
}

export interface VoteOnNoteParams {
  userId: number
  fragranceId: number
  noteId: number
  layer: NoteLayerEnum
  vote?: boolean | null | undefined
}

export class FragranceNotesRepo extends TableService<'fragranceNotes', FragranceNoteRow> {
  fillers: NoteFillersRepo
  votes: NoteVotesRepo

  voteFactory = new VoteFactory()

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceNotes')

    this.fillers = new NoteFillersRepo(sources)
    this.votes = new NoteVotesRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        const query = this
          .Table
          .connection
          .selectFrom('fragranceNotes')
          .innerJoin('notes', 'notes.id', 'fragranceNotes.noteId')
          .leftJoin('fragrances', 'fragrances.id', 'fragranceNotes.fragranceId')
          .leftJoin('fragranceNoteVotes as nv', join =>
            join
              .onRef('nv.fragranceNoteId', '=', 'fragranceNotes.id')
              .on('nv.userId', '=', userId)
              .on('nv.deletedAt', 'is', null)
          )
          .selectAll('fragranceNotes')
          .select([
            'nv.vote as myVote',
            'notes.id as noteId',
            'notes.s3Key',
            'notes.name'
          ])

        return query
      })
  }

  vote (
    params: VoteOnNoteParams
  ): ResultAsync<FragranceNoteRow, ApiError> {
    const db = this.sources.db

    return ResultAsync
      .fromPromise(
        db
          .transaction()
          .execute(async trx => {
            this.withConnection(trx)
            this.votes.withConnection(trx)

            return await this
              .voteInner(params)
              .match(
                row => row,
                throwError
              )
              .finally(() => {
                this.withConnection(db)
                this.votes.withConnection(db)
              })
          }),
        error => ApiError.fromDatabase(error)
      )
  }

  private voteInner (
    params: VoteOnNoteParams
  ): ResultAsync<FragranceNoteRow, ApiError> {
    const { userId, fragranceId, noteId, layer, vote } = params
    const [value, deletedAt, updatedAt] = this.voteFactory.value(vote)

    return this
      .findOrCreate(
        eb => eb.and([
          eb('fragranceNotes.fragranceId', '=', fragranceId),
          eb('fragranceNotes.noteId', '=', noteId),
          eb('fragranceNotes.layer', '=', layer)
        ]),
        {
          fragranceId,
          noteId,
          layer
        }
      )
      .andThen(fragranceNoteRow => this
        .votes
        .vote({
          userId,
          fragranceNoteId: fragranceNoteRow.id,
          vote: value,
          updatedAt,
          deletedAt
        })
        .map(({ previousVoteRow }) => ({ fragranceNoteRow, previousVoteRow }))
      )
      .andThen(({ fragranceNoteRow, previousVoteRow }) => {
        const prev = previousVoteRow?.vote ?? 0
        const next = value

        const [
          likesDelta,
          dislikesDelta
        ] = this.voteFactory.getDeltas(prev, next)

        const updated = this.voteFactory.getUpdatedValuesObj(likesDelta, dislikesDelta)

        return this
          .updateOne(
            eb => eb('fragranceNotes.id', '=', fragranceNoteRow.id),
            updated
          )
      })
      .andThen(row => this
        .findOne(
          eb => eb('fragranceNotes.id', '=', row.id)
        )
      )
  }
}
