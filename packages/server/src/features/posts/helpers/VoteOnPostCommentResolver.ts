import { AGGREGATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { VoteOnPostCommentInputSchema } from '../utils/validation.js'
import type { VoteOnPostCommentSchemaType } from '../types.js'

type Mutation = MutationResolvers['voteOnPostComment']

export class VoteOnPostCommentResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    const parsed = parseOrThrow(VoteOnPostCommentInputSchema, input)

    const comment = await unwrapOrThrow(this.getComment(parsed))

    await unwrapOrThrow(this.upsertVote(parsed))
    await this.enqueueAggregation(parsed)

    return comment
  }

  private enqueueAggregation (parsed: VoteOnPostCommentSchemaType) {
    const { commentId } = parsed
    const { queues } = this.context

    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_POST_COMMENT,
        data: {
          commentId,
          type: 'votes'
        }
      })
  }

  private getComment (parsed: VoteOnPostCommentSchemaType) {
    const { posts } = this.context.services
    const { commentId } = parsed

    return posts.comments
      .findOne(
        eb => eb('id', '=', commentId)
      )
  }

  private upsertVote (parsed: VoteOnPostCommentSchemaType) {
    const { me, context } = this
    const { services } = context

    const { commentId, vote } = parsed
    const userId = me.id

    const { posts } = services

    return posts.comments.votes
      .upsert(
        {
          commentId,
          userId,
          vote
        },
        oc => oc
          .columns(['commentId', 'userId'])
          .doUpdateSet({ vote, updatedAt: new Date().toISOString() })
      )
  }
}