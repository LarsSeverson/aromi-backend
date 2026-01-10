import { AGGREGATION_JOB_NAMES, BackendError, INDEXATION_JOB_NAMES, parseOrThrow, removeNullish, unwrapOrThrow, type PostCommentRow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import type { UpdatePostCommentSchemaType } from '../types.js'
import { UpdatePostCommentSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['updatePostComment']

export class UpdatePostCommentResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  async resolve () {
    const { context } = this
    const { services } = context

    const { comment } = await services.withTransaction(async trx => {
      this.trxServices = trx
      return await this.handleResolve()
    })

    await this.handleIndex(comment)
    await this.handleAggregation(comment.postId)

    return comment
  }

  private async handleResolve () {
    const parsed = this.validateArguments()

    const currentReply = await unwrapOrThrow(this.getReply(parsed))
    this.checkAuthorized(currentReply)

    const comment = await unwrapOrThrow(this.updateReply(parsed))

    return { comment }
  }

  private handleIndex (comment: PostCommentRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.UPDATE_POST_COMMENT,
      data: comment
    })
  }

  private handleAggregation (postId: string) {
    const { queues } = this.context

    return queues.aggregations.enqueue({
      jobName: AGGREGATION_JOB_NAMES.AGGREGATE_POST,
      data: {
        postId,
        type: 'comments'
      }
    })
  }

  private validateArguments () {
    const { args } = this
    const { input } = args

    const parsed = parseOrThrow(UpdatePostCommentSchema, input)

    return parsed
  }

  private getReply (parsed: UpdatePostCommentSchemaType) {
    const { id } = parsed
    const { posts } = this.trxServices!

    return posts.comments.findOne(
      where => where('id', '=', id)
    )
  }

  private updateReply (parsed: UpdatePostCommentSchemaType) {
    const { posts } = this.trxServices!

    const values = removeNullish(parsed) as Partial<PostCommentRow>

    return posts.comments.updateOne(
      where => where('id', '=', parsed.id),
      values
    )
  }

  private checkAuthorized (comment: PostCommentRow) {
    const { me } = this
    if (comment.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to update this comment',
        403
      )
    }
  }
}