import { unwrapOrThrow, type INDEXATION_JOB_NAMES, type IndexationJobPayload, type UserRow } from '@aromi/shared'
import { BaseIndexer } from './BaseIndexer.js'
import type { Job } from 'bullmq'

type JobKey = typeof INDEXATION_JOB_NAMES.UPDATE_USER

export class UserUpdater extends BaseIndexer<IndexationJobPayload[JobKey], UserRow> {
  async index (job: Job<IndexationJobPayload[JobKey]>): Promise<UserRow> {
    const { userId } = job.data

    const user = await unwrapOrThrow(this.getUser(userId))
    await unwrapOrThrow(this.updateUser(user))

    await this.updateUserPosts(user)
    await this.updateUserPostComments(user)
    await this.updateUserReviews(user)

    return user
  }

  private getUser (id: string) {
    const { services } = this.context
    const { users } = services

    return users
      .findOne(
        where => where('id', '=', id)
      )
  }

  private updateUser (user: UserRow) {
    const { search } = this.context.services
    const { users } = search

    const doc = search.users.fromRow(user)

    return users.updateDocument(doc)
  }

  private async updateUserPosts (user: UserRow) {
    const { posts, search } = this.context.services

    const userPosts = await unwrapOrThrow(
      posts.find(
        where => where('userId', '=', user.id)
      )
    )

    const docs = userPosts.map(post => search.posts.fromRow({ post, user }))

    await unwrapOrThrow(
      search.posts.updateDocuments(docs)
    )

    return docs
  }

  private async updateUserPostComments (user: UserRow) {
    const { posts, search } = this.context.services

    const userComments = await unwrapOrThrow(
      posts.comments.find(
        where => where('userId', '=', user.id)
      )
    )

    const docs = userComments.map(comment => search.posts.comments.fromRow({ comment, user }))

    await unwrapOrThrow(
      search.posts.comments.updateDocuments(docs)
    )

    return docs
  }

  private async updateUserReviews (user: UserRow) {
    const { fragrances, search } = this.context.services

    const userReviews = await unwrapOrThrow(
      fragrances.reviews.find(
        where => where('userId', '=', user.id)
      )
    )

    const docs = userReviews.map(review => search.reviews.fromRow({ review, user }))

    await unwrapOrThrow(
      search.reviews.updateDocuments(docs)
    )

    return docs
  }
}