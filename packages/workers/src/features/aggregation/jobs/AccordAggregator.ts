import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import { INDEXATION_JOB_NAMES, type FragranceAccordScoreRow } from '@aromi/shared'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_ACCORD_VOTES

export class AccordAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceAccordScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceAccordScoreRow> {
    const { fragranceId, accordId } = job.data

    const score = await this.updateScore(fragranceId, accordId)

    await this.enqueueIndex(score)

    return score
  }

  private enqueueIndex (score: FragranceAccordScoreRow) {
    const { queues } = this.context
    const { indexations } = queues

    return indexations
      .enqueue({
        jobName: INDEXATION_JOB_NAMES.INDEX_FRAGRANCE,
        data: { fragranceId: score.fragranceId }
      })
  }

  private async updateScore (fragranceId: string, accordId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { accords } = fragrances

    return await accords
      .scores
      .aggregate(fragranceId, accordId)
  }
}