import { BaseAggregator } from './BaseAggregator.js'
import { type FragranceNoteScoreRow, INDEXATION_JOB_NAMES, type NoteLayerEnum, unwrapOrThrow } from '@aromi/shared'
import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES

export class NoteAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceNoteScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceNoteScoreRow> {
    const { fragranceId, noteId, layer } = job.data

    await unwrapOrThrow(this.getScore(fragranceId, noteId, layer))
    const score = await unwrapOrThrow(this.updateScore(fragranceId, noteId, layer))

    await this.enqueueIndex(score)

    return score
  }

  private enqueueIndex (score: FragranceNoteScoreRow) {
    const { queues } = this.context
    const { indexations } = queues

    return indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId: score.fragranceId }
      })
  }

  private getScore (
    fragranceId: string,
    noteId: string,
    layer: NoteLayerEnum
  ) {
    const { services } = this.context
    const { fragrances } = services
    const { notes } = fragrances

    return notes
      .scores
      .findOrCreate(
        eb => eb.and([
          eb('fragranceId', '=', fragranceId),
          eb('noteId', '=', noteId),
          eb('layer', '=', layer)
        ]),
        { fragranceId, noteId, layer }
      )
  }

  private updateScore (
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