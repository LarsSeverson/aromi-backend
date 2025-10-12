import type { AssetResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class AssetFieldResolvers extends BaseResolver<AssetResolvers> {
  url: AssetResolvers['url'] = (
    parent,
    args,
    context,
    info
  ) => {
    const { s3Key } = parent
    const { services } = context

    if (s3Key == null) return null

    const { assets } = services

    return assets.getCdnUrl(s3Key)
  }

  sizeBytes: AssetResolvers['sizeBytes'] = (
    parent,
    args,
    context,
    info
  ) => {
    const { sizeBytes } = parent
    if (sizeBytes == null) return 0
    return Number(sizeBytes)
  }

  getResolvers (): AssetResolvers {
    return {
      url: this.url,
      sizeBytes: this.sizeBytes
    }
  }
}