import { BackendError, INDEXATION_JOB_NAMES, type PostRow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'

type Mutation = MutationResolvers['deletePost']

export class DeletePostResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  async resolve () {
    const { context } = this
    const { services } = context

    const { post } = await services.withTransaction(async (trx) => {
      this.trxServices = trx
      return await this.handleResolve()
    })

    await this.handleIndex(post)

    return post
  }

  private async handleResolve () {
    const { args } = this
    const { input } = args
    const { id: postId } = input

    const post = await this.getPost(postId)

    this.checkAuthorized(post)

    await this.deletePost(postId)

    const assetIds = await this.deletePostAssets(postId)

    await this.deleteUploads(assetIds)

    return { post }
  }

  private handleIndex (post: PostRow) {
    const { queues } = this.context

    return queues.indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.DELETE_POST,
      data: post
    })
  }

  private async getPost (postId: string) {
    const { posts } = this.trxServices!

    return await unwrapOrThrow(
      posts.findOne((where) => where('id', '=', postId))
    )
  }

  private async deletePost (postId: string) {
    const { posts } = this.trxServices!

    return await unwrapOrThrow(
      posts.softDeleteOne((where) => where('id', '=', postId))
    )
  }

  private async deletePostAssets (postId: string) {
    const { posts } = this.trxServices!

    const postAssets = await unwrapOrThrow(
      posts.assets.softDelete((where) => where('postId', '=', postId))
    )

    return postAssets.map((pa) => pa.assetId)
  }

  private async deleteUploads (assetIds: string[]) {
    const { assets } = this.trxServices!

    return await unwrapOrThrow(
      assets.uploads.softDelete((where) => where('id', 'in', assetIds))
    )
  }

  private checkAuthorized (post: PostRow) {
    const { me } = this

    if (post.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to delete this post',
        403
      )
    }
  }
}