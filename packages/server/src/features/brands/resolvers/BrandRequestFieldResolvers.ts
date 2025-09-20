import { BackendError, throwError, unwrapOrThrow } from '@aromi/shared'
import type { BrandRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { ResultAsync } from 'neverthrow'
import { mapVoteInfoRowToVoteInfo } from '@src/utils/mappers.js'

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
    const { id } = parent
    const { me, loaders } = context

    const { brandRequests } = loaders

    return await ResultAsync
      .fromPromise(
        brandRequests
          .getVotesLoader(me?.id)
          .load(id),
        error => BackendError.fromDatabase(error)
      )
      .match(
        mapVoteInfoRowToVoteInfo,
        throwError
      )
  }

  getResolvers (): BrandRequestResolvers {
    return {
      avatar: this.avatar,
      votes: this.votes
    }
  }
}
