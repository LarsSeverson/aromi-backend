import type { DB, NoteLayerEnum } from '@src/db/db-schema.js'
import type { CombinedFragranceNoteScoreRow, FragranceNoteScoreRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { TableService } from '@src/db/services/TableService.js'
import type { CursorPaginationInput } from '@src/db/types.js'
import type { SelectQueryBuilder, ReferenceExpression, ExpressionOrFactory, SqlBool } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { BackendError, unwrapOrThrow } from '@src/utils/error.js'

export class FragranceNoteScoreService extends TableService<FragranceNoteScoreRow> {
  constructor (sources: DataSources) {
    super(sources, 'fragranceNoteScores')
  }

  findNotes (
    where?: ExpressionOrFactory<DB, 'fragranceNoteScores' | 'notes', SqlBool>
  ) {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNoteScores.noteId')
      .select('fragranceNoteScores.layer')
      .selectAll('notes')
      .where('notes.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  findCombinedNotes <C>(
    where?: ExpressionOrFactory<DB, 'fragranceNoteScores', SqlBool>,
    pagination?: CursorPaginationInput<C>
  ): ResultAsync<CombinedFragranceNoteScoreRow[], BackendError> {
    let query = this
      .Table
      .baseQuery
      .innerJoin('notes', 'notes.id', 'fragranceNoteScores.noteId')
      .selectAll('fragranceNoteScores')
      .select([
        'notes.id as id',
        'notes.id as noteId',
        'notes.name as noteName',
        'notes.description as noteDescription',
        'notes.thumbnailImageId as noteThumbnailImageId'
      ])
      .where('notes.deletedAt', 'is', null)

    if (where != null) {
      query = query.where(where)
    }

    if (pagination != null) {
      query = this.paginatedCombinedNotesQuery(pagination, query)
    }

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => BackendError.fromDatabase(error)
      )
  }

  private paginatedCombinedNotesQuery<C, R>(
    input : CursorPaginationInput<C>,
    qb: SelectQueryBuilder<DB, 'fragranceNoteScores' | 'notes', R>
  ) {
    const { first, column, operator, direction, cursor } = input

    const parsedColumn = `fragranceNoteScores.${column}` as ReferenceExpression<DB, 'fragranceNoteScores'>
    const idColumn = 'fragranceNoteScores.noteId'

    return qb
      .$if(cursor.isValid, qb =>
        qb.where(w =>
          w.or([
            w.eb(parsedColumn, operator, cursor.value),
            w.and([
              w.eb(parsedColumn, '=', cursor.value),
              w.eb(idColumn, operator, cursor.lastId)
            ])
          ])
        )
      )
      .orderBy(parsedColumn, direction)
      .orderBy(idColumn, direction)
      .limit(first + 1)
  }

  async aggregate (
    fragranceId: string,
    noteId: string,
    layer: NoteLayerEnum
  ) {
    await unwrapOrThrow(
      this.findOrCreate(
        where => where.and([
          where('fragranceId', '=', fragranceId),
          where('noteId', '=', noteId),
          where('layer', '=', layer)
        ]),
        { fragranceId, noteId, layer }
      )
    )

    const score = await unwrapOrThrow(
      this.updateOne(
        eb => eb
          .and([
            eb('fragranceId', '=', fragranceId),
            eb('noteId', '=', noteId),
            eb('layer', '=', layer)
          ]),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceNoteVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('vote', '=', 1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('upvotes')
            )
            .where('fragranceNoteVotes.fragranceId', '=', fragranceId)
            .where('fragranceNoteVotes.noteId', '=', noteId)
            .where('fragranceNoteVotes.layer', '=', layer),
          downvotes: eb
            .selectFrom('fragranceNoteVotes')
            .select(eb =>
              eb
                .fn
                .coalesce(
                  eb.fn.sum<number>(
                    eb.case()
                      .when('vote', '=', -1)
                      .then(1)
                      .else(0)
                      .end()
                  ),
                  eb.val(0)
                )
                .as('downvotes')
            )
            .where('fragranceNoteVotes.fragranceId', '=', fragranceId)
            .where('fragranceNoteVotes.noteId', '=', noteId)
            .where('fragranceNoteVotes.layer', '=', layer),
          updatedAt: new Date().toISOString()
        })
      )
    )

    return score
  }
}