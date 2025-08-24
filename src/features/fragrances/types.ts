import { type DB } from '@src/db/schema'
import { type FragranceDraft } from '@src/generated/gql-types'
import { type Selectable } from 'kysely'

export type FragranceDraftRow = Selectable<DB['fragranceDrafts']>

export interface IFragranceDraftSummary extends Omit<FragranceDraft, 'images' | 'user'> {}
