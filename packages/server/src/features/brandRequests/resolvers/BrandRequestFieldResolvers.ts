import { ApiError, throwError } from '@aromi/shared'
import type { BrandRequestResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { ResultAsync } from 'neverthrow'
import { mapBrandRequestImageRowToBrandImage } from '../utils/mappers.js'
import { mapVoteInfoRowToVoteInfo } from '@src/utils/mappers.js'

export class BrandRequestFieldResolvers extends BaseResolver<BrandRequestResolvers> {
  image: BrandRequestResolvers['image'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services, loaders } = context

    const { brandRequests } = loaders
    const { assets } = services

    return await ResultAsync
      .fromPromise(
        brandRequests
          .getImageLoader()
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        row => {
          if (row == null) return null

          const image = mapBrandRequestImageRowToBrandImage(row)
          image.url = assets.getCdnUrl(row.s3Key)

          return image
        },
        throwError
      )
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
        error => ApiError.fromDatabase(error)
      )
      .match(
        mapVoteInfoRowToVoteInfo,
        throwError
      )
  }

  getResolvers (): BrandRequestResolvers {
    return {
      image: this.image,
      votes: this.votes
    }
  }
}
