import { type PostRow, unwrapOrThrow, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type PostDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'
import { okAsync } from 'neverthrow'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_POST

export class PostIndexer extends BaseIndexer<IndexationJobPayload[JobKey], PostDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PostDoc> {
    const { services } = this.context
    const { search } = services

    const { id } = job.data

    const postRow = await unwrapOrThrow(this.getPost(id))
    const userRow = await unwrapOrThrow(this.getUser(postRow))
    const fragranceRow = await unwrapOrThrow(this.getFragrance(postRow))

    const doc = search.posts.fromRow({ post: postRow, user: userRow, fragrance: fragranceRow })

    await unwrapOrThrow(
      search
        .posts
        .addDocument(doc)
    )

    return doc
  }

  private getPost (id: string) {
    const { services } = this.context
    const { posts } = services

    return posts
      .findOne(
        eb => eb('id', '=', id)
      )
  }

  private getUser (row: PostRow) {
    const { services } = this.context
    const { users } = services

    return users
      .findOne(
        eb => eb('id', '=', row.userId)
      )
  }

  private getFragrance (row: PostRow) {
    const { services } = this.context
    const { fragrances } = services

    if (row.fragranceId == null) return okAsync(undefined)

    return fragrances
      .findOne(
        eb => eb('id', '=', row.fragranceId)
      )
  }
}