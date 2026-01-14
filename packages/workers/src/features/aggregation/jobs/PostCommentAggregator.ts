import type { AGGREGATION_JOB_NAMES, AggregationJobPayload } from '@aromi/shared/src/queues/services/aggregation/types.js'
import { BaseAggregator } from './BaseAggregator.js'
import type { PostCommentRow } from '@aromi/shared/src/db/index.js'
import type { Job } from 'bullmq'
import { unwrapOrThrow } from '@aromi/shared'

type JobKey = typeof AGGREGATION_JOB_NAMES.AGGREGATE_POST_COMMENT

export class PostCommentAggregator extends BaseAggregator<AggregationJobPayload[JobKey], PostCommentRow> {
  async aggregate (job: Job<AggregationJobPayload[JobKey]>): Promise<PostCommentRow> {
    const postData = job.data
    const { commentId, type } = postData

    const shouldUpdateAll = type === 'all'
    const shouldUpdateVotes = type === 'votes' || shouldUpdateAll
    const shouldUpdateComments = type === 'comments' || shouldUpdateAll

    // Ensure score record exists
    await this.getScore(commentId)

    if (shouldUpdateVotes) {
      await this.updateScore(commentId)
    }

    if (shouldUpdateComments) {
      await this.updateComments(commentId)
    }

    const comment = await this.updateComment(commentId)

    return comment
  }

  private async getScore (commentId: string) {
    const { services } = this.context
    const { posts } = services

    return await unwrapOrThrow(
      posts.comments.scores
        .findOrCreate(
          eb => eb('commentId', '=', commentId),
          { commentId }
        )
    )
  }

  private async updateScore (commentId: string) {
    const { services } = this.context
    const { posts } = services

    return await posts.comments.scores.aggregateVotes(commentId)
  }

  private async updateComments (commentId: string) {
    const { services } = this.context
    const { posts } = services

    return await unwrapOrThrow(
      posts.comments.scores.updateOne(
        where => where('commentId', '=', commentId),
        eb => ({
          commentCount: eb
            .selectFrom('postComments')
            .where('parentId', '=', commentId)
            .where('deletedAt', 'is', null)
            .select(({ fn }) => fn.countAll<number>().as('commentCount')),
          updatedAt: new Date().toISOString()
        })
      )
    )
  }

  private async updateComment (commentId: string) {
    const { services } = this.context
    const { posts } = services

    return await unwrapOrThrow(
      posts.comments.updateOne(
        where => where('id', '=', commentId),
        { updatedAt: new Date().toISOString() }
      )
    )
  }
}