import type { NoteLayerEnum } from '@src/db/db-schema.js'

export const AGGREGATION_JOB_NAMES = {
  AGGREGATE_ACCORD_VOTES: 'aggregate-accord-votes',
  AGGREGATE_NOTE_VOTES: 'aggregate-note-votes'
} as const

export type AggregationJobName = (typeof AGGREGATION_JOB_NAMES)[keyof typeof AGGREGATION_JOB_NAMES]

export interface AggregationJobPayload {
  [AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES]: { fragranceId: string, accordId: string }
  [AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES]: { fragranceId: string, noteId: string, layer: NoteLayerEnum }
}
