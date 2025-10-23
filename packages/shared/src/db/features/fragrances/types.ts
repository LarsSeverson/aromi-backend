import type { DB, NoteLayerEnum, NoteRow } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type FragranceRow = Selectable<DB['fragrances']>
export type FragranceImageRow = Selectable<DB['fragranceImages']>
export type FragranceEditRow = Selectable<DB['fragranceEdits']>

export type FragranceVoteRow = Selectable<DB['fragranceVotes']>
export type FragranceScoreRow = Selectable<DB['fragranceScores']>

export type FragranceAccordVoteRow = Selectable<DB['fragranceAccordVotes']>
export type FragranceAccordScoreRow = Selectable<DB['fragranceAccordScores']>

export type FragranceNoteVoteRow = Selectable<DB['fragranceNoteVotes']>
export type FragranceNoteScoreRow = Selectable<DB['fragranceNoteScores']>

export type FragranceTraitVoteRow = Selectable<DB['fragranceTraitVotes']>

export type FragranceReviewRow = Selectable<DB['fragranceReviews']>
export type FragranceReviewVoteRow = Selectable<DB['fragranceReviewVotes']>
export type FragranceReviewScoreRow = Selectable<DB['fragranceReviewScores']>

export type FragranceCollectionRow = Selectable<DB['fragranceCollections']>
export type FragranceCollectionItemRow = Selectable<DB['fragranceCollectionItems']>

export const PREVIEW_ITEMS_LIMIT = 4

export interface AggFragranceTraitVoteRow {
  fragranceId: string
  traitOptionId: string
  votes: number
}

export interface LayerNoteRow extends NoteRow {
  layer: NoteLayerEnum
}

export interface CombinedFragranceAccordScoreRow extends FragranceAccordScoreRow {
  id: string
  accordId: string
  accordName: string
  accordColor: string
  accordDescription: string | null
}

export interface CombinedFragranceNoteScoreRow extends FragranceNoteScoreRow {
  id: string
  noteId: string
  noteName: string
  noteDescription: string | null
  noteThumbnailImageId: string | null
}

export interface CombinedFragranceCollectionItemRow extends FragranceRow {
  itemId: string
  itemRank: number
}

export type FragranceRequestRow = Selectable<DB['fragranceRequests']>
export type FragranceRequestTraitRow = Selectable<DB['fragranceRequestTraits']>
export type FragranceRequestAccordRow = Selectable<DB['fragranceRequestAccords']>
export type FragranceRequestNoteRow = Selectable<DB['fragranceRequestNotes']>
export type FragranceRequestVoteRow = Selectable<DB['fragranceRequestVotes']>
export type FragranceRequestScoreRow = Selectable<DB['fragranceRequestScores']>

export type FragranceRequestRowWithVotes = FragranceRequestRow & {
  upvotes: number
}
