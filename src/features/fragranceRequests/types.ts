import type { DB } from '@src/db/schema'
import { type FragranceRequest } from '@src/generated/gql-types'
import type { Selectable } from 'kysely'

export type FragranceRequestRow = Selectable<DB['fragranceRequests']>
export type FragranceRequestImageRow = Selectable<DB['fragranceRequestImages']>
export type FragranceRequestTraitRow = Selectable<DB['fragranceRequestTraits']>
export type FragranceRequestAccordRow = Selectable<DB['fragranceRequestAccords']>
export type FragranceRequestNoteRow = Selectable<DB['fragranceRequestNotes']>
export type FragranceRequestVoteRow = Selectable<DB['fragranceRequestVotes']>

export interface IFragranceRequestSummary extends
  Omit<FragranceRequest, 'brand' | 'image' | 'user' | 'trait' | 'traits' | 'accords' | 'notes' | 'votes'> {
  brandId: string | null
}

export type FragranceRequestLoadersKey = string
