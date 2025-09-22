export const PROMOTION_JOB_NAMES = {
  PROMOTE_FRAGRANCE: 'promote-fragrance',
  PROMOTE_BRAND: 'promote-brand',
  PROMOTE_ACCORD: 'promote-accord',
  PROMOTE_NOTE: 'promote-note'
} as const

export type PromotionJobName = (typeof PROMOTION_JOB_NAMES)[keyof typeof PROMOTION_JOB_NAMES]

export interface PromotionJobPayload {
  [PROMOTION_JOB_NAMES.PROMOTE_FRAGRANCE]: { requestId: string }
  [PROMOTION_JOB_NAMES.PROMOTE_BRAND]: { requestId: string }
  [PROMOTION_JOB_NAMES.PROMOTE_ACCORD]: { requestId: string }
  [PROMOTION_JOB_NAMES.PROMOTE_NOTE]: { requestId: string }
}

export type PromotionJobData = PromotionJobPayload[keyof PromotionJobPayload]

export const PROMOTION_SCORE_THRESHOLD = 10