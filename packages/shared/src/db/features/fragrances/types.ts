import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type FragranceRow = Selectable<DB['fragrances']>
export type FragranceImageRow = Selectable<DB['fragranceImages']>
export type FragranceAccordRow = Selectable<DB['fragranceAccords']>
export type FragranceNoteRow = Selectable<DB['fragranceNotes']>
export type FragranceTraitVoteRow = Selectable<DB['fragranceTraitVotes']>

export interface ExistingNoteRow extends FragranceNoteRow {
  name: string
  description: string | null
  s3Key: string | null
  thumbnailImageId: string | null
}