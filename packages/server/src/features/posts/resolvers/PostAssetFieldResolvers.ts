import { BackendError, unwrapOrThrow } from '@aromi/shared'
import type { PostAssetResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class PostAssetFieldResolvers extends BaseResolver<PostAssetResolvers> {
  asset: PostAssetResolvers['asset'] = async (
    postAsset,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { assetId } = postAsset

    const asset = await unwrapOrThrow(
      loaders.assets.load(assetId)
    )

    if (asset == null) {
      throw new BackendError(
        'NOT_FOUND',
        `Asset with ID "${assetId}" not found`,
        404
      )
    }

    return asset
  }

  post: PostAssetResolvers['post'] = async (
    postAsset,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { postId } = postAsset

    const post = await unwrapOrThrow(
      loaders.posts.load(postId)
    )

    if (post == null) {
      throw new BackendError(
        'NOT_FOUND',
        `Post with ID "${postId}" not found`,
        404
      )
    }

    return post
  }

  getResolvers (): PostAssetResolvers {
    return {
      asset: this.asset,
      post: this.post
    }
  }
}