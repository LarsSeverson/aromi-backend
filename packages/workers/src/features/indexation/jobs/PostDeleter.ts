import { unwrapOrThrow, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type PostDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.DELETE_POST

export class PostDeleter extends BaseIndexer<IndexationJobPayload[JobKey], PostDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PostDoc> {
    const { services } = this.context
    const { search } = services

    const { id } = job.data

    const doc = await unwrapOrThrow(search.posts.getDocument(id))
    await unwrapOrThrow(search.posts.deleteDocuments([id]))

    return doc
  }
}