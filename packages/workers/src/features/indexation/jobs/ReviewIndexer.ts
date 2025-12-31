import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type IndexationJobPayload, type ReviewDoc, type FragranceReviewRow, type UserRow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_REVIEW

export class ReviewIndexer extends BaseIndexer<IndexationJobPayload[JobKey], ReviewDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<ReviewDoc> {
    const { reviewId } = job.data

    const reviewRow = await unwrapOrThrow(this.getReview(reviewId))
    const userRow = await unwrapOrThrow(this.getUser(reviewRow))

    const doc = await unwrapOrThrow(this.indexReview(reviewRow, userRow))

    return doc
  }

  private getReview (reviewId: string) {
    const { services } = this.context
    const { fragrances } = services

    return fragrances.reviews.findOne(eb => eb('id', '=', reviewId))
  }

  private getUser (row: FragranceReviewRow) {
    const { services } = this.context
    const { users } = services

    return users.findOne(eb => eb('id', '=', row.userId))
  }

  private indexReview (review: FragranceReviewRow, user: UserRow) {
    const { services } = this.context
    const { search } = services
    const { reviews } = search

    const doc = reviews.fromRow({ review, user })

    return reviews.addDocument(doc).map(() => doc)
  }
}