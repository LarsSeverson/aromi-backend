export const PROMOTION_JOB_NAMES = {
  PROMOTE_FRAGRANCES: 'promote-fragrances',
  PROMOTE_BRANDS: 'promote-brands',
  PROMOTE_ACCORDS: 'promote-accords',
  PROMOTE_NOTES: 'promote-notes'
} as const

export type PromotionJobName = (typeof PROMOTION_JOB_NAMES)[keyof typeof PROMOTION_JOB_NAMES]

export type PromotionJobPayloads = {
  [K in PromotionJobName]: {
    id: string
  }
}
