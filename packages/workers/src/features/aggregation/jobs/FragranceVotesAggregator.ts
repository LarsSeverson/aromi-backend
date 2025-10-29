import { unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_VOTES

export class FragranceVotesAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceScoreRow> {
    const { fragranceId } = job.data

    await unwrapOrThrow(this.getScore(fragranceId))
    const score = await this.updateScore(fragranceId)

    return score
  }

  private getScore (fragranceId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances

    return scores
      .findOrCreate(
        eb => eb('fragranceId', '=', fragranceId),
        { fragranceId }
      )
  }

  private async updateScore (fragranceId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances

    return await scores.aggregateVotes(fragranceId)
  }
}