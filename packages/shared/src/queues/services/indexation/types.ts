import type { BrandDoc } from '@src/search/features/brands/types.js'
import type { AccordDoc, FragranceDoc, NoteDoc } from '@src/search/index.js'
import type { PartialWithId } from '@src/utils/util-types.js'

export const INDEXATION_JOB_NAMES = {
  INDEX_FRAGRANCE: 'index-fragrance',
  UPDATE_FRAGRANCE: 'update-fragrance',

  INDEX_BRAND: 'index-brand',
  UPDATE_BRAND: 'update-brand',

  INDEX_ACCORD: 'index-accord',
  UPDATE_ACCORD: 'update-accord',

  INDEX_NOTE: 'index-note',
  UPDATE_NOTE: 'update-note',

  INDEX_USER: 'index-user'
} as const

export type IndexationJobName = (typeof INDEXATION_JOB_NAMES)[keyof typeof INDEXATION_JOB_NAMES]

export interface IndexationJobPayload {
  [INDEXATION_JOB_NAMES.INDEX_FRAGRANCE]: { fragranceId: string }
  [INDEXATION_JOB_NAMES.INDEX_BRAND]: { brandId: string }
  [INDEXATION_JOB_NAMES.INDEX_ACCORD]: { accordId: string }
  [INDEXATION_JOB_NAMES.INDEX_NOTE]: { noteId: string }

  [INDEXATION_JOB_NAMES.UPDATE_FRAGRANCE]: PartialWithId<FragranceDoc>
  [INDEXATION_JOB_NAMES.UPDATE_BRAND]: PartialWithId<BrandDoc>
  [INDEXATION_JOB_NAMES.UPDATE_ACCORD]: PartialWithId<AccordDoc>
  [INDEXATION_JOB_NAMES.UPDATE_NOTE]: PartialWithId<NoteDoc>

  [INDEXATION_JOB_NAMES.INDEX_USER]: { userId: string }
}