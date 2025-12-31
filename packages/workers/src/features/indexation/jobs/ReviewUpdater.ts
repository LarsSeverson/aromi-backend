import { type INDEXATION_JOB_NAMES, type IndexationJobPayload, type FragranceReviewRow, unwrapOrThrow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_REVIEW

export class ReviewUpdater extends BaseIndexer<IndexationJobPayload[JobKey], FragranceReviewRow> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<FragranceReviewRow> {
    const { reviewId } = job.data

    const review = await unwrapOrThrow(this.getReview(reviewId))
    await unwrapOrThrow(this.updateReview(review))

    return review
  }

  private getReview (id: string) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances.reviews
      .findOne(
        eb => eb('id', '=', id)
      )
  }

  private updateReview (review: FragranceReviewRow) {
    const { search } = this.context.services
    const { reviews } = search

    return reviews.updateDocument(review)
  }
}