import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type IndexationJobPayload, type PostRow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_POST

export class PostUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PostRow> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PostRow> {
    const { id } = job.data

    const post = await unwrapOrThrow(this.getPost(id))
    await unwrapOrThrow(this.updatePost(post))

    return post
  }

  private getPost (id: string) {
    const { services } = this.context
    const { posts } = services

    return posts
      .findOne(
        eb => eb('id', '=', id)
      )
  }

  private updatePost (post: PostRow) {
    const { search } = this.context.services
    const { posts } = search

    return posts.updateDocument(post)
  }
}