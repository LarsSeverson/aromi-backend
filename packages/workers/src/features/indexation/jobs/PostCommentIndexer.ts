import { type INDEXATION_JOB_NAMES, type PostCommentRow, unwrapOrThrow, type IndexationJobPayload, type PostCommentDoc } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.INDEX_POST_COMMENT

export class PostCommentIndexer extends BaseIndexer<IndexationJobPayload[JobKey], PostCommentDoc> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<PostCommentDoc> {
    const { services } = this.context
    const { search } = services

    const { id } = job.data

    const commentRow = await unwrapOrThrow(this.getComment(id))
    const userRow = await unwrapOrThrow(this.getUser(commentRow))

    const doc = search.posts.comments.fromRow({ comment: commentRow, user: userRow })

    await unwrapOrThrow(
      search
        .posts.comments
        .addDocument(doc)
    )

    return doc
  }

  private getComment (id: string) {
    const { services } = this.context
    const { posts } = services

    return posts.comments
      .findOne(
        eb => eb('id', '=', id)
      )
  }

  getUser (row: PostCommentRow) {
    const { services } = this.context
    const { users } = services

    return users
      .findOne(
        eb => eb('id', '=', row.userId)
      )
  }
}