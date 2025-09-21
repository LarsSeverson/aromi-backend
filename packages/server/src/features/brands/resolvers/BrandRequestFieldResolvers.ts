import { unwrapOrThrow } from '@aromi/shared'
import type { BrandRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { BrandRequestVotesResolver } from '../helpers/BrandRequestVotesResolver.js'

export class BrandRequestFieldResolvers extends BaseResolver<BrandRequestResolvers> {
  avatar: BrandRequestResolvers['avatar'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { assetId } = parent
    if (assetId == null) return null

    const { services } = context
    const { assets } = services

    const asset = await unwrapOrThrow(
      assets
        .uploads
        .findOne(eb => eb('id', '=', assetId))
    )

    return asset
  }

  votes: BrandRequestResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new BrandRequestVotesResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): BrandRequestResolvers {
    return {
      avatar: this.avatar,
      votes: this.votes
    }
  }
}
