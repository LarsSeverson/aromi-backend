import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceNote, NoteLayer, type FragranceNotesResolvers } from '@src/generated/gql-types'
import { okAsync, ResultAsync } from 'neverthrow'
import { ApiResolver, VoteSortByColumn } from './apiResolver'
import { type FragranceNoteRow } from '@src/services/repositories/FragranceNotesRepo'

export class NoteResolver extends ApiResolver {
  notes: FragranceNotesResolvers['top' | 'middle' | 'base'] = async (parent, args, context, info) => {
    const { id } = parent.parent
    const { input } = args
    const { loaders } = context
    const layer = info.fieldName as NoteLayerEnum

    const { pagination, fill } = input ?? {}
    let isFill = false

    const normalizedInput = this
      .paginationFactory
      .normalize(
        pagination,
        pagination?.sort?.by ?? 'VOTES',
        (decoded) => {
          const [value, fillFlag] = String(decoded).split('|')
          isFill = fillFlag === '1'
          return value
        }
      )

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => VoteSortByColumn[normalizedInput.sort.by])

    const loader = isFill
      ? loaders.fragrance.getFillerNotesLoader({ layer, pagination: parsedInput })
      : loaders.fragrance.getNotesLoader({ layer, pagination: parsedInput })

    return await ResultAsync
      .fromPromise(
        loader.load({ fragranceId: id }),
        error => error
      )
      .andThen(rows => {
        if (isFill) return okAsync(rows)
        if (!(fill ?? false)) return okAsync(rows)
        if (rows.length >= parsedInput.first) return okAsync(rows)

        const needed = parsedInput.first - rows.length
        const fillInput = { ...parsedInput, first: needed }

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
            parsedInput,
            (row) => `${row[parsedInput.column]}|${row.isFill ? '1' : '0'}`,
            mapFragranceNoteRowToFragranceNote
          ),
        error => { throw error }
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
    name, layer,
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

    isFill: isFill ?? false
  }
}
