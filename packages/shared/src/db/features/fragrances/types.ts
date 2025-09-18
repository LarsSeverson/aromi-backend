import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type FragranceRow = Selectable<DB['fragrances']>
export type FragranceImageRow = Selectable<DB['fragranceImages']>

export type FragranceAccordVoteRow = Selectable<DB['fragranceAccordVotes']>
export type FragranceAccordScoreRow = Selectable<DB['fragranceAccordScores']>

export type FragranceNoteVoteRow = Selectable<DB['fragranceNoteVotes']>
export type FragranceNoteScoreRow = Selectable<DB['fragranceNoteScores']>

export type FragranceTraitVoteRow = Selectable<DB['fragranceTraitVotes']>

export interface AggFragranceTraitVoteRow {
  fragranceId: string
  traitOptionId: string
  votes: number
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
  noteS3Key: string
  noteDescription: string | null
}