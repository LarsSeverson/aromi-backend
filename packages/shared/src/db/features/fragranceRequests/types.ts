import type { DB } from '@src/db/index.js'
import type { Selectable } from 'kysely'

export type FragranceRequestRow = Selectable<DB['fragranceRequests']>
export type FragranceRequestImageRow = Selectable<DB['fragranceRequestImages']>
export type FragranceRequestTraitRow = Selectable<DB['fragranceRequestTraits']>
export type FragranceRequestAccordRow = Selectable<DB['fragranceRequestAccords']>
export type FragranceRequestNoteRow = Selectable<DB['fragranceRequestNotes']>
export type FragranceRequestVoteRow = Selectable<DB['fragranceRequestVotes']>

export type FragrnanceRequestRowWithVotes = FragranceRequestRow & {
  upvotes: number
}
