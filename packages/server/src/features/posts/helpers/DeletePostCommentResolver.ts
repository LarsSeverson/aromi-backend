import { AGGREGATION_JOB_NAMES, BackendError, INDEXATION_JOB_NAMES, type PostCommentRow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'

type Mutation = MutationResolvers['deletePostComment']

export class DeletePostCommentResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  async resolve () {
    const { context } = this
    const { services } = context

    const { comment } = await services.withTransaction(async (trx) => {
      this.trxServices = trx
      return await this.handleResolve()
    })

    await this.handleIndex(comment)
    await this.handleAggregation(comment.postId)

    return comment
  }

  private async handleResolve () {
    const { args } = this
    const { input } = args
    const { id: commentId } = input

    const comment = await this.fetchReply(commentId)

    this.checkAuthorized(comment.userId)

    await this.deleteReply(commentId)

    const assetIds = await this.deleteReplyAssets(commentId)

    await this.deleteUploads(assetIds)

    return { comment }
  }

  private handleIndex (comment: PostCommentRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.DELETE_POST_COMMENT,
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

  private async fetchReply (commentId: string) {
    const { posts } = this.trxServices!

    return await unwrapOrThrow(
      posts.comments.findOne((where) => where('id', '=', commentId))
    )
  }

  private async deleteReply (commentId: string) {
    const { posts } = this.trxServices!

    return await unwrapOrThrow(
      posts.comments.softDeleteOne((where) => where('id', '=', commentId))
    )
  }

  private async deleteReplyAssets (commentId: string) {
    const { posts } = this.trxServices!

    const commentAssets = await unwrapOrThrow(
      posts.comments.assets.softDelete((where) => where('commentId', '=', commentId))
    )

    return commentAssets.map((ra) => ra.assetId)
  }

  private async deleteUploads (assetIds: string[]) {
    const { assets } = this.trxServices!

    return await unwrapOrThrow(
      assets.uploads.softDelete((where) => where('id', 'in', assetIds))
    )
  }

  private checkAuthorized (ownerId: string) {
    const { me } = this

    if (ownerId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to delete this comment',
        403
      )
    }
  }
}