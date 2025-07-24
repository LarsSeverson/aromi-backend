import { type ApiDataSources } from '@src/datasources/datasources'
import { TableService } from '../TableService'
import { type FragranceNoteRow } from './FragranceNotesRepo'
import { type NoteLayerEnum } from '@src/db/schema'
import { type ParsedPaginationInput } from '@src/factories/PaginationFactory'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { sql } from 'kysely'

export class NoteFillersRepo extends TableService<'notes', FragranceNoteRow> {
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
        sql<NoteLayerEnum>`${layer}`.as('layer'),
        sql<number>`${fragranceId}`.as('fragranceId'),
        sql<number>`0`.as('dislikesCount'),
        sql<number>`0`.as('likesCount'),
        sql<number>`0`.as('voteScore'),
        sql<number | null>`0`.as('myVote')
      ])

    if (pagination != null) {
      query = this
        .Table
        .paginatedQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error)
      )
  }
}
