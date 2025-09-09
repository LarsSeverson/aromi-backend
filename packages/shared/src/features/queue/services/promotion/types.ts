import type { AccordRequestRow, BrandRequestRow, FragranceRequestRow, NoteRequestRow } from '@src/db/index.js'

export const PROMOTION_JOB_NAMES = {
  PROMOTE_FRAGRANCE: 'promote-fragrance',
  PROMOTE_BRAND: 'promote-brands',
  PROMOTE_ACCORD: 'promote-accord',
  PROMOTE_NOTE: 'promote-note'
} as const

export type PromotionJobName = (typeof PROMOTION_JOB_NAMES)[keyof typeof PROMOTION_JOB_NAMES]

export interface PromotionJobPayload {
  [PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE]: FragranceRequestRow
  [PROMOTION_JOB_NAMES.PROMOTE_BRAND]: BrandRequestRow
  [PROMOTION_JOB_NAMES.PROMOTE_ACCORD]: AccordRequestRow
  [PROMOTION_JOB_NAMES.PROMOTE_NOTE]: NoteRequestRow
}
