import { type NoteLayerEnum, type DB } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { TableService, type MyVote } from '../TableService'
import { type ApiDataSources } from '@src/datasources/datasources'
import { INVALID_ID } from '@src/common/types'

export interface FragranceNoteRow extends Selectable<DB['fragranceNotes']>, MyVote {
  noteId: number
  name: string
  isFill: boolean
}

export class FragranceNotesRepo extends TableService<'fragranceNotes', FragranceNoteRow> {
  fillers: FragranceNotesFillerRepo

  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceNotes')

    this.fillers = new FragranceNotesFillerRepo(sources)

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
            'notes.name',
            sql<boolean>`FALSE`.as('isFill')
          ])
      })
  }
}

export class FragranceNotesFillerRepo extends TableService<'fragranceNotes', FragranceNoteRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'fragranceNotes')

    this
      .Table
      .setAlias('fillerNotes')
      .setBaseQueryFactory(() => {
        const subquery = sources
          .db
          .selectFrom('notes')
          .selectAll('notes')
          .select([
            'notes.id as noteId',
            sql<number>`${INVALID_ID}`.as('fragranceId'),
            sql<number>`0`.as('dislikesCount'),
            sql<number>`0`.as('likesCount'),
            sql<number>`0`.as('voteScore'),
            sql<number>`0`.as('myVote'),
            sql<NoteLayerEnum>``.as('layer'),
            sql<boolean>`TRUE`.as('isFill')
          ])
          .as('fillerNotes')

        return sources
          .db
          .selectFrom(subquery)
          .selectAll()
      })
  }
}
