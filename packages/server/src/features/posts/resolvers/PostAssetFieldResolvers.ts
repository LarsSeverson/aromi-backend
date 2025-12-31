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

  getResolvers (): PostAssetResolvers {
    return {
      asset: this.asset
    }
  }
}