import { BaseAggregator } from './BaseAggregator.js'
import { type FragranceNoteScoreRow, type NoteLayerEnum, unwrapOrThrow } from '@aromi/shared'
import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES

export class NoteAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceNoteScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceNoteScoreRow> {
    const { fragranceId, noteId, layer } = job.data

    const scoreRow = await unwrapOrThrow(this.handleUpdateRow(fragranceId, noteId, layer))

    return scoreRow
  }

  handleUpdateRow (
    fragranceId: string,
    noteId: string,
    layer: NoteLayerEnum
  ) {
    const { services } = this.context
    const { fragrances } = services
    const { notes } = fragrances

    return notes
      .scores
      .updateOne(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('noteId', '=', noteId),
          eb('layer', '=', layer)
        ]),
        eb => ({
          upvotes: eb
            .selectFrom('fragranceNoteVotes')
            .select(eb.fn.countAll<number>().as('upvotes'))
            .where('fragranceNoteVotes.fragranceId', '=', fragranceId)
            .where('fragranceNoteVotes.noteId', '=', noteId)
            .where('fragranceNoteVotes.layer', '=', layer),
          updatedAt: new Date().toISOString()
        })
      )
  }
}