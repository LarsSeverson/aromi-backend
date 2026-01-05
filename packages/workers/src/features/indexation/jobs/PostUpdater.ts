import { type INDEXATION_JOB_NAMES, unwrapOrThrow, type IndexationJobPayload, type PostRow, type PostFromRowParams } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'
import { okAsync } from 'neverthrow'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_POST

export class PostUpdater extends BaseIndexer<IndexationJobPayload[JobKey], PostRow> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PostRow> {
    const { id } = job.data

    const post = await unwrapOrThrow(this.getPost(id))
    const user = await unwrapOrThrow(this.getPostUser(post))
    const fragrance = await unwrapOrThrow(this.getPostFragrance(post))

    await unwrapOrThrow(this.updatePost({ post, user, fragrance }))

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

  private getPostUser (row: PostRow) {
    const { services } = this.context
    const { users } = services

    return users
      .findOne(
        eb => eb('id', '=', row.userId)
      )
  }

  private getPostFragrance (row: PostRow) {
    const { services } = this.context
    const { fragrances } = services

    if (row.fragranceId == null) return okAsync(undefined)

    return fragrances
      .findOne(
        eb => eb('id', '=', row.fragranceId)
      )
  }

  private updatePost (row: PostFromRowParams) {
    const { search } = this.context.services
    const { posts } = search

    const doc = search.posts.fromRow(row)

    return posts.updateDocument(doc)
  }
}