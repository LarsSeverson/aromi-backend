import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { errAsync, okAsync, type ResultAsync } from 'neverthrow'
import { type ApiError } from '@src/common/error'

export type NoteVoteRow = Selectable<DB['fragranceNoteVotes']>

export interface NoteVoteParams {
  userId: number
  fragranceNoteId: number
  vote: number
  updatedAt: string
  deletedAt: string | null
}

export class NoteVotesRepo extends TableService<'fragranceNoteVotes', NoteVoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceNoteVotes')
  }

  vote (
    params: NoteVoteParams
  ): ResultAsync<{ previousVoteRow: NoteVoteRow | null, updatedVoteRow: NoteVoteRow }, ApiError> {
    const {
      userId,
      fragranceNoteId,
      vote,
      updatedAt,
      deletedAt
    } = params

    return this
      .findOne(
        eb => eb.and([
          eb('fragranceNoteVotes.fragranceNoteId', '=', fragranceNoteId),
          eb('fragranceNoteVotes.userId', '=', userId)
        ])
      )
      .orElse(error => {
        if (error.status === 404) {
          return okAsync(null)
        }

        return errAsync(error)
      })
      .andThen(previousVoteRow => this
        .upsert(
          {
            userId,
            fragranceNoteId,
            vote,
            deletedAt
          },
          oc => oc
            .columns(['userId', 'fragranceNoteId'])
            .doUpdateSet({
              vote,
              deletedAt,
              updatedAt
            })
        )
        .map(updatedVoteRow => ({ previousVoteRow, updatedVoteRow }))
      )
  }
}
