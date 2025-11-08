import { unwrapOrThrow, type AGGREGATION_JOB_NAMES, type AggregationJobPayload, type FragranceScoreRow } from '@aromi/shared'
import { BaseAggregator } from './BaseAggregator.js'
import type { Job } from 'bullmq'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_FRAGRANCE_REVIEWS

export class FragranceReviewsAggregator extends BaseAggregator<AggregationJobPayload[JobKey], FragranceScoreRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<FragranceScoreRow> {
    const { fragranceId } = job.data

    const score = await unwrapOrThrow(this.getScore(fragranceId))

    await unwrapOrThrow(this.updateReviewCount(fragranceId))
    await unwrapOrThrow(this.updateAverageRating(fragranceId))

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

  private updateReviewCount (fragranceId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances

    return scores.updateOne(
      where => where('fragranceId', '=', fragranceId),
      eb => ({
        reviewCount: eb
          .selectFrom('fragranceReviews')
          .where('fragranceId', '=', fragranceId)
          .where('deletedAt', 'is', null)
          .select(({ fn }) => fn.countAll<number>().as('reviewCount'))
      })
    )
  }

  private updateAverageRating (fragranceId: string) {
    const { services } = this.context
    const { fragrances } = services
    const { scores } = fragrances

    return scores.updateOne(
      where => where('fragranceId', '=', fragranceId),
      eb => ({
        averageRating: eb
          .selectFrom('fragranceReviews')
          .where('fragranceId', '=', fragranceId)
          .where('deletedAt', 'is', null)
          .select(({ fn }) => fn.avg<number>('rating').as('averageRating'))
      })
    )
  }
}