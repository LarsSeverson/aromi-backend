import type { DB } from '@src/db/schema'
import type { FragranceDraft, FragranceDraftImage } from '@src/generated/gql-types'
import type { Selectable } from 'kysely'

export type FragranceDraftRow = Selectable<DB['fragranceDrafts']>
export type FragranceDraftImageRow = Selectable<DB['fragranceDraftImages']>
export type FragranceDraftTraitRow = Selectable<DB['fragranceDraftTraits']>
export type FragranceDraftAccordRow = Selectable<DB['fragranceDraftAccords']>

export interface IFragranceDraftSummary extends Omit<FragranceDraft, 'image' | 'user' | 'trait' | 'traits' | 'accords'> { }
export interface IFragranceDraftImageSummary extends Omit<FragranceDraftImage, 'draft'> {}

export interface DraftTraitResult {
  traitTypeId: string
  traitTypeName: string
  optionId: string | null
  optionLabel: string | null
  optionScore: number | null
}
