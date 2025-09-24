import { BaseAggregator } from './BaseAggregator.js'
import { type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceNoteScoreRow, INDEXATION_JOB_NAMES, type NoteLayerEnum } from '@aromi/shared'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_NOTE_VOTES

export class NoteAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceNoteScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceNoteScoreRow> {
    const { fragranceId, noteId, layer } = job.data

    const score = await this.updateScore(fragranceId, noteId, layer)

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

  private async updateScore (
    fragranceId: string,
    noteId: string,
    layer: NoteLayerEnum
  ) {
    const { services } = this.context
    const { fragrances } = services
    const { notes } = fragrances

    return await notes
      .scores
      .aggregate(fragranceId, noteId, layer)
  }
}