import { BackendError, unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { FragranceReviewResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'

export class FragranceReviewFieldResolvers extends BaseResolver<FragranceReviewResolvers> {
  author: FragranceReviewResolvers['author'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { loaders } = context

    const { users } = loaders

    const row = await unwrapOrThrow(users.load(userId))

    if (row == null) {
      throw new BackendError(
        'NOT_FOUND',
        `User with ID ${userId} not found`,
        404
      )
    }

    return mapUserRowToUserSummary(row)
  }

  fragrance: FragranceReviewResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { fragranceId } = parent
    const { loaders } = context

    const { fragrances } = loaders

    const row = await unwrapOrThrow(fragrances.load(fragranceId))

    if (row == null) {
      throw new BackendError(
        'NOT_FOUND',
        `Fragrance with ID ${fragranceId} not found`,
        404
      )
    }

    return mapFragranceRowToFragranceSummary(row)
  }

  votes: FragranceReviewResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, loaders } = context

    const { fragrances } = loaders

    const score = await unwrapOrThrow(fragrances.reviews.loadScore(id))
    const userVote = await unwrapOrThrow(fragrances.reviews.loadUserVote(id, me?.id))

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: userVote?.vote
    }

    return votes
  }

  getResolvers (): FragranceReviewResolvers {
    return {
      author: this.author,
      fragrance: this.fragrance,
      votes: this.votes
    }
  }
}