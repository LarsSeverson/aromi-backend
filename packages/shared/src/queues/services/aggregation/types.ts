import type { NoteLayerEnum } from '@src/db/db-schema.js'

export const AGGREGATION_JOB_NAMES = {
  AGGREGATE_FRAGRANCE_REVIEWS: 'aggregate-fragrance-reviews',
  AGGREGATE_FRAGRANCE_VOTES: 'aggregate-fragrance-votes',
  AGGREGATE_FRAGRANCE_REQUEST_VOTES: 'aggregate-fragrance-request-votes',

  AGGREGATE_BRAND_VOTES: 'aggregate-brand-votes',
  AGGREGATE_BRAND_REQUEST_VOTES: 'aggregate-brand-request-votes',

  AGGREGATE_ACCORD_VOTES: 'aggregate-accord-votes',
  AGGREGATE_ACCORD_REQUEST_VOTES: 'aggregate-accord-request-votes',

  AGGREGATE_NOTE_VOTES: 'aggregate-note-votes',
  AGGREGATE_NOTE_REQUEST_VOTES: 'aggregate-note-request-votes',

  AGGREGATE_REVIEW_VOTES: 'aggregate-review-votes',

  AGGREGATE_POST: 'aggregate-post'
} as const

export type AggregationJobName = (typeof AGGREGATION_JOB_NAMES)[keyof typeof AGGREGATION_JOB_NAMES]

export interface AggregatePostPayload extends Record<string, unknown> {
  postId: string
  type: 'votes' | 'comments' | 'all'
}

export interface AggregationJobPayload {
  [AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS]: { fragranceId: string }
  [AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES]: { fragranceId: string }
  [AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REQUEST_VOTES]: { requestId: string }

  [AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_VOTES]: { brandId: string }
  [AGGREGATION_JOB_NAMES.AGGREGATE_BRAND_REQUEST_VOTES]: { requestId: string }

  [AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES]: { fragranceId: string, accordId: string }
  [AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_REQUEST_VOTES]: { requestId: string }

  [AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES]: { fragranceId: string, noteId: string, layer: NoteLayerEnum }
  [AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_REQUEST_VOTES]: { requestId: string }

  [AGGREGATION_JOB_NAMES.AGGREGATE_REVIEW_VOTES]: { reviewId: string }

  [AGGREGATION_JOB_NAMES.AGGREGATE_POST]: AggregatePostPayload
}
