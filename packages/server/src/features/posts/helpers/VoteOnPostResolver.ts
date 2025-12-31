import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { VoteOnPostInputSchema } from '../utils/validation.js'
import { AGGREGATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'

type Mutation = MutationResolvers['voteOnPost']

export class VoteOnPostResolver extends MutationResolver<Mutation> {
  async resolve () {
    const { input } = this.args
    parseOrThrow(VoteOnPostInputSchema, input)

    const post = await unwrapOrThrow(this.getPost())

    await unwrapOrThrow(this.upsertVote())
    await this.enqueueAggregation()

    return post
  }

  private enqueueAggregation () {
    const { postId } = this.args.input
    const { queues } = this.context

    const { aggregations } = queues

    return aggregations
      .enqueue({
        jobName: AGGREGATION_JOB_NAMES.AGGREGATE_POST,
        data: {
          postId,
          type: 'votes'
        }
      })
  }

  private getPost () {
    const { args, context } = this

    const { input } = args
    const { services } = context

    const { postId } = input
    const { posts } = services

    return posts
      .findOne(
        eb => eb('id', '=', postId)
      )
  }

  private upsertVote () {
    const { me, args, context } = this
    const { services } = context

    const { postId, vote } = args.input
    const userId = me.id

    const { posts } = services

    return posts
      .votes
      .upsert(
        { postId, userId, vote },
        oc => oc
          .columns(['postId', 'userId'])
          .doUpdateSet({ vote, updatedAt: new Date().toISOString() })
      )
  }
}