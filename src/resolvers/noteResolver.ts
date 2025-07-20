import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceNote, NoteLayer, type FragranceNotesResolvers } from '@src/generated/gql-types'
import { okAsync, ResultAsync } from 'neverthrow'
import { ApiResolver, FILLER_FLAG } from './apiResolver'
import { type FragranceNoteRow } from '@src/services/repositories/FragranceNotesRepo'
import { type ParsedPaginationInput } from '@src/factories/PagiFactory'
import { throwError } from '@src/common/error'

export class NoteResolver extends ApiResolver {
  notes: FragranceNotesResolvers['top' | 'middle' | 'base'] = async (parent, args, context, info) => {
    const { id } = parent.parent
    const { input } = args
    const { loaders, services } = context
    const layer = info.fieldName as NoteLayerEnum

    const { pagination, fill } = input ?? {}

    const normalized = this.pagination.normalize(pagination, 'VOTES')
    const parsed = this.pagination.parse(normalized)

    const [cursorValue, fillFlag] = String(parsed.cursor.value).split('|')
    const isFill = fillFlag === FILLER_FLAG

    this.pagination.decode(parsed, cursorValue)

    const loader = isFill
      ? loaders.fragrance.getFillerNotesLoader({ layer, pagination: parsed })
      : loaders.fragrance.getNotesLoader({ layer, pagination: parsed })

    return await ResultAsync
      .fromPromise(
        loader.load({ fragranceId: id }),
        error => error
      )
      .andThen(rows => {
        if (isFill) return okAsync(rows)
        if (!(fill ?? false)) return okAsync(rows)
        if (rows.length > parsed.first) return okAsync(rows)

        const needed = parsed.first - rows.length

        const fillInput: ParsedPaginationInput = {
          ...parsed,
          first: needed,
          column: 'id',
          cursor: {
            ...parsed.cursor,
            isValid: false
          }
        }

        return ResultAsync
          .fromPromise(
            loaders
              .fragrance
              .getFillerNotesLoader({ layer, pagination: fillInput })
              .load({ fragranceId: id }),
            error => error
          )
          .map(filled => rows.concat(filled))
      })
      .match(
        rows => this
          .newPage(
            rows,
            parsed,
            (row) => `${row[parsed.column]}|${row.isFill ? FILLER_FLAG : ''}`,
            (row) => {
              const note = mapFragranceNoteRowToFragranceNote(row)

              if (note.thumbnail != null) {
                note.thumbnail = services.asset.publicizeField(note.thumbnail)
              }

              return note
            }
          ),
        throwError
      )
  }
}

export const DB_NOTE_LAYER_TO_GQL_NOTE_LAYER: Record<NoteLayerEnum, NoteLayer> = {
  top: NoteLayer.Top,
  middle: NoteLayer.Middle,
  base: NoteLayer.Base
} as const

export const GQL_NOTE_LAYER_TO_DB_NOTE_LAYER: Record<NoteLayer, NoteLayerEnum> = {
  TOP: 'top',
  MIDDLE: 'middle',
  BASE: 'base'
} as const

export const mapFragranceNoteRowToFragranceNote = (row: FragranceNoteRow): FragranceNote => {
  const {
    id, noteId,
    name, s3Key, layer,
    voteScore, likesCount, dislikesCount, myVote,
    createdAt, updatedAt, deletedAt,
    isFill
  } = row

  // TODO: s3Key to some property if planning to store note icon in s3
  return {
    id,
    noteId,
    name,
    layer: DB_NOTE_LAYER_TO_GQL_NOTE_LAYER[layer],

    votes: {
      voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt),

    isFill: isFill ?? false,
    thumbnail: s3Key
  }
}
