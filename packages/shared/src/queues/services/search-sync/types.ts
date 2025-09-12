export const SEARCH_SYNC_JOB_NAMES = {
  SYNC_FRAGRANCE: 'sync-fragrance'
} as const

export type SearchSyncJobName = (typeof SEARCH_SYNC_JOB_NAMES)[keyof typeof SEARCH_SYNC_JOB_NAMES]

export interface SearchSyncJobPayload {
  [SEARCH_SYNC_JOB_NAMES.SYNC_FRAGRANCE]: { fragranceId: string }
}