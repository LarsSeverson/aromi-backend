import { getPaginationParams } from '@src/common/pagination'
import { type NoteLayerEnum } from '@src/db/schema'
import { type FragranceNote, NoteLayer, type FragranceNotesResolvers, type VoteSortBy } from '@src/generated/gql-types'
import { type FragranceNoteRow } from '@src/services/fragranceService'
import { ResultAsync } from 'neverthrow'
import { ApiResolver } from './apiResolver'

export class NoteResolver extends ApiResolver {
  notes: FragranceNotesResolvers['top' | 'middle' | 'base'] = async (parent, args, context, info) => {
    const { id } = parent.parent
    const { input } = args
    const { loaders } = context

    const { pagination: paginationInput, fill } = input ?? {}
    const paginationParams = getPaginationParams<VoteSortBy>(paginationInput)
    const layer = info.fieldName as NoteLayerEnum

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getNotesLoader({ layer, paginationParams, fill: fill?.valueOf() })
          .load({ fragranceId: id }),
        error => error
      )
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: mapFragranceNoteRowToFragranceNote
          }),
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
      score: voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },

    audit: {
      createdAt,
      updatedAt,
      deletedAt
    },

    isFill: isFill ?? false
  }
}
