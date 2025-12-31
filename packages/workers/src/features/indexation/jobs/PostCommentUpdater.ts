import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type PartialWithId, type IndexationJobPayload, type PostCommentDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_POST_COMMENT

export class PostCommentUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<PostCommentDoc>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<PostCommentDoc>> {
    const comment = job.data

    const doc = await unwrapOrThrow(this.updateComment(comment))

    return doc
  }

  updateComment (comment: PartialWithId<PostCommentDoc>) {
    const { search } = this.context.services
    const { posts } = search

    return posts.comments
      .updateDocument(comment)
      .map(() => comment)
  }
}