import type { DB } from '@src/db/schema'
import type { FragranceDraft, FragranceDraftImage } from '@src/generated/gql-types'
import type { Selectable } from 'kysely'

export type FragranceDraftRow = Selectable<DB['fragranceDrafts']>
export type FragranceDraftImageRow = Selectable<DB['fragranceDraftImages']>

export interface IFragranceDraftSummary extends Omit<FragranceDraft, 'image' | 'user'> { }
export interface IFragranceDraftImageSummary extends Omit<FragranceDraftImage, 'draft'> {}
