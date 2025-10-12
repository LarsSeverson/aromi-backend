import type { AGGREGATION_JOB_NAMES, AggregationJobPayload, FragranceReviewScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_REVIEW_VOTES

export class ReviewAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceReviewScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceReviewScoreRow> {
    const { reviewId } = job.data

    const score = await this.updateScore(reviewId)

    return score
  }

  private async updateScore (reviewId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { reviews } = fragrances

    return await reviews
      .scores
      .aggregate(reviewId)
  }
}