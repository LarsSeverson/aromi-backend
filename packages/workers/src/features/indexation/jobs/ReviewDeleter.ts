import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type IndexationJobPayload, type ReviewDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.DELETE_REVIEW

export class ReviewDeleter extends BaseIndexer<IndexationJobPayload[JobKey], ReviewDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<ReviewDoc> {
    const { services } = this.context
    const { search } = services

    const { reviewId } = job.data

    const doc = await unwrapOrThrow(search.reviews.getDocument(reviewId))
    await unwrapOrThrow(search.reviews.deleteDocuments([reviewId]))

    return doc
  }
}