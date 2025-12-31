import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type PartialWithId, type IndexationJobPayload, type PostDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_POST

export class PostUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PartialWithId<PostDoc>> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PartialWithId<PostDoc>> {
    const post = job.data

    const doc = await unwrapOrThrow(this.updatePost(post))

    return doc
  }

  updatePost (post: PartialWithId<PostDoc>) {
    const { search } = this.context.services
    const { posts } = search

    return posts
      .updateDocument(post)
      .map(() => post)
  }
}