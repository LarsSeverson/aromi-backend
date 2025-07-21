import { type NoteLayerEnum, type DB } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { TableService, type MyVote } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type ParsedPaginationInput } from '@src/factories/PagiFactory'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'

export interface FragranceNoteRow extends Selectable<DB['fragranceNotes']>, MyVote {
  noteId: number
  name: string
  s3Key: string | null
}

class FillerNotesRepo extends TableService<'notes', FragranceNoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'notes')
  }

  fill (
    fragranceId: number,
    layer: NoteLayerEnum,
    pagination?: ParsedPaginationInput
  ): ResultAsync<FragranceNoteRow[], ApiError> {
    let query = this
      .sources
      .db
      .selectFrom('notes')
      .leftJoin('fragranceNotes', join =>
        join
          .onRef('fragranceNotes.noteId', '=', 'notes.id')
          .on('fragranceNotes.fragranceId', '=', fragranceId)
          .on('fragranceNotes.layer', '=', layer)
      )
      .where('fragranceNotes.id', 'is', null)
      .selectAll('notes')
      .select([
        'notes.id as noteId',
        sql<NoteLayerEnum>``.as('layer'),
        sql<number>`${fragranceId}`.as('fragranceId'),
        sql<number>`0`.as('dislikesCount'),
        sql<number>`0`.as('likesCount'),
        sql<number>`0`.as('voteScore'),
        sql<number | null>`0`.as('myVote')
      ])

    if (pagination != null) {
      query = this
        .Table
        .paginatedQuery(pagination)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error)
      )
  }
}

export class FragranceNotesRepo extends TableService<'fragranceNotes', FragranceNoteRow> {
  fillers: FillerNotesRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceNotes')

    this.fillers = new FillerNotesRepo(sources)

    this
      .Table
      .setBaseQueryFactory(() => {
        const userId = this.context.me?.id ?? null

        return sources
          .db
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
      })
  }
}
