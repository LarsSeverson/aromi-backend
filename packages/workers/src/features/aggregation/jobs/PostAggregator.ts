import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import type { PostRow } from '@aromi/shared/src/db/index.js'
import type { Job } from 'bullmq'
import { unwrapOrThrow } from '@aromi/shared'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_POST

export class PostAggregator extends BaseAggregator<AggregationJobPayload[JobKey], PostRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<PostRow> {
    const postData = job.data
    const { postId, type } = postData

    const shouldUpdateAll = type === 'all'
    const shouldUpdateVotes = type === 'votes' || shouldUpdateAll
    const shouldUpdateComments = type === 'comments' || shouldUpdateAll

    // Ensure score record exists
    await this.getScore(postId)

    if (shouldUpdateVotes) {
      await this.updateScore(postId)
    }

    if (shouldUpdateComments) {
      await this.updateComments(postId)
    }

    const post = await this.updatePost(postId)

    return post
  }

  private async getScore (postId: string) {
    const { services } = this.context
    const { posts } = services
    const { scores } = posts

    return await unwrapOrThrow(
      scores
        .findOrCreate(
          eb => eb('postId', '=', postId),
          { postId }
        )
    )
  }

  private async updateScore (postId: string) {
    const { services } = this.context
    const { posts } = services

    return await posts.scores.aggregateVotes(postId)
  }

  private async updateComments (postId: string) {
    const { services } = this.context
    const { posts } = services

    return await unwrapOrThrow(
      posts.scores.updateOne(
        where => where('postId', '=', postId),
        eb => ({
          commentCount: eb
            .selectFrom('postComments')
            .where('postId', '=', postId)
            .where('deletedAt', 'is', null)
            .select(({ fn }) => fn.countAll<number>().as('commentCount'))
        })
      )
    )
  }

  private async updatePost (postId: string) {
    const { services } = this.context
    const { posts } = services

    return await unwrapOrThrow(
      posts.updateOne(
        where => where('id', '=', postId),
        { updatedAt: new Date().toISOString() }
      )
    )
  }
}