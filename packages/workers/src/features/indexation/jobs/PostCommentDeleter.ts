import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type IndexationJobPayload, type PostCommentDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.DELETE_POST_COMMENT

export class PostCommentDeleter extends BaseIndexer<IndexationJobPayload[JobKey], PostCommentDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PostCommentDoc> {
    const { services } = this.context
    const { search } = services

    const { id } = job.data

    const doc = await unwrapOrThrow(search.posts.comments.getDocument(id))
    await unwrapOrThrow(search.posts.comments.deleteDocuments([id]))

    return doc
  }
}