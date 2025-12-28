import type { FragranceVoteResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'
import { BackendError, unwrapOrThrow } from '@aromi/shared'

export class FragranceVoteFieldResolvers extends BaseResolver<FragranceVoteResolvers> {
  fragrance: FragranceVoteResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { fragranceId } = parent

    const fragrance = await unwrapOrThrow(loaders.fragrances.load(fragranceId))

    if (fragrance == null) {
      throw new BackendError(
        'NOT_FOUND',
        `Fragrance with ID ${fragranceId} not found`,
        404
      )
    }

    return mapFragranceRowToFragranceSummary(fragrance)
  }

  user: FragranceVoteResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { loaders } = context
    const { userId } = parent

    const user = await unwrapOrThrow(loaders.users.load(userId))

    if (user == null) {
      throw new BackendError(
        'NOT_FOUND',
        `User with ID ${userId} not found`,
        404
      )
    }

    return user
  }

  getResolvers (): FragranceVoteResolvers {
    return {
      fragrance: this.fragrance,
      user: this.user
    }
  }
}