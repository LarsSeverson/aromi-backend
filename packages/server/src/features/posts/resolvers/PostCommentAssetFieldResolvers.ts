import { BackendError, unwrapOrThrow } from '@aromi/shared'
import type { PostCommentAssetResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class PostCommentAssetFieldResolvers extends BaseResolver<PostCommentAssetResolvers> {
  asset: PostCommentAssetResolvers['asset'] = async (
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

  getResolvers (): PostCommentAssetResolvers {
    return {
      asset: this.asset
    }
  }
}