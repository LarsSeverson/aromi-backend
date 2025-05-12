import { encodeCursor } from '@src/common/cursor'
import { extractPaginationParams, newPage, type Page, type PaginationParams } from '@src/common/pagination'
import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceNote, NoteLayer, type FragranceNotesResolvers, type FragranceNoteEdge, SortBy } from '@src/generated/gql-types'
import { type FragranceNoteRow } from '@src/services/fragranceService'
import { ResultAsync } from 'neverthrow'

export class NoteResolvers {
  notes: FragranceNotesResolvers['top' | 'middle' | 'base'] = async (parent, args, context, info) => {
    const { id } = parent.parent
    const { input } = args
    const { me, loaders } = context

    const { pagination: paginationInput, fill } = input ?? {}
    const paginationParams = extractPaginationParams(paginationInput)
    const layer = info.fieldName as NoteLayerEnum

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .withMe(me)
          .withPagination(paginationParams)
          .withFill(fill?.valueOf())
          .notes
          .load({ fragranceId: id, layer }),
        error => error
      )
      .match(
        rows => this.mapFragranceNoteRowsToPage(rows, paginationParams),
        error => { throw error }
      )
  }

  private mapFragranceNoteRowsToPage (rows: FragranceNoteRow[], paginationParams: PaginationParams): Page<FragranceNote> {
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapFragranceNoteToEdge(this.mapFragranceNoteRowToFragranceNote(row), paginationParams))
    const page = newPage({ first, cursor, edges })

    return page
  }

  private mapFragranceNoteToEdge (note: FragranceNote, paginationParams: PaginationParams): FragranceNoteEdge {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? note.id : note.audit[column]
    const cursor = encodeCursor(sortValue, note.id)

    return { node: note, cursor }
  }

  private mapFragranceNoteRowToFragranceNote (row: FragranceNoteRow): FragranceNote {
    const {
      id, noteId,
      name, layer,
      votes, myVote,
      createdAt, updatedAt, deletedAt,
      isFill
    } = row

    // TODO: s3Key to some property if planning to store note icon in s3
    return {
      id,
      noteId,
      name,
      layer: DB_NOTE_LAYER_TO_GQL_NOTE_LAYER[layer],
      votes,
      myVote: myVote != null,

      audit: {
        createdAt,
        updatedAt,
        deletedAt
      },

      isFill: isFill ?? false
    }
  }
}

const DB_NOTE_LAYER_TO_GQL_NOTE_LAYER: Record<NoteLayerEnum, NoteLayer> = {
  top: NoteLayer.Top,
  middle: NoteLayer.Middle,
  base: NoteLayer.Base
} as const

// const GQL_NOTE_LAYER_TO_DB_NOTE_LAYER: Record<NoteLayer, NoteLayerEnum> = {
//   TOP: 'top',
//   MIDDLE: 'middle',
//   BASE: 'base'
// } as const
