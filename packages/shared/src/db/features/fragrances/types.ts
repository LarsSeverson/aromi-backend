import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type FragranceRow = Selectable<DB['fragrances']>
export type FragranceImageRow = Selectable<DB['fragranceImages']>
export type FragranceAccordRow = Selectable<DB['fragranceAccords']>
export type FragranceNoteRow = Selectable<DB['fragranceNotes']>
export type FragranceTraitVoteRow = Selectable<DB['fragranceTraitVotes']>

export interface CombinedFragranceAccordRow extends FragranceAccordRow {
  accordId: string
  accordName: string
  accordColor: string
  accordDescription: string | null
}

export interface CombinedFragranceNoteRow extends FragranceNoteRow {
  noteId: string
  noteName: string
  noteS3Key: string
  noteDescription: string | null
}

export interface AggFragranceTraitVoteRow {
  fragranceId: string
  traitOptionId: string
  votes: number
}