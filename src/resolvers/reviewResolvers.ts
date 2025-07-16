import { type MutationResolvers, type FragranceReviewResolvers as FragranceReviewFieldResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { ResultAsync } from 'neverthrow'
import { mapUserRowToUserSummary } from './userResolver'
import { mapFragranceRowToFragranceSummary } from './fragranceResolver'
import { type FragranceReviewRow } from '@src/services/repositories/FragranceReviewsRepo'
import { type FragranceReviewSummary } from '@src/schemas/fragrance/mappers'
import { ApiError } from '@src/common/error'

export class ReviewResolver extends ApiResolver {
  reviewUser: FragranceReviewFieldResolvers['user'] = async (parent, args, context, info) => {
    const { userId } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getUserLoader()
          .load({ userId }),
        error => error
      )
      .match(
        mapUserRowToUserSummary,
        error => { throw error }
      )
  }

  reviewFragrance: FragranceReviewFieldResolvers['fragrance'] = async (parent, args, context, info) => {
    const { fragranceId } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getFragranceLoader()
          .load({ fragranceId }),
        error => error
      )
      .match(
        mapFragranceRowToFragranceSummary,
        error => { throw error }
      )
  }

  voteOnReview: MutationResolvers['voteOnReview'] = async (_, args, context, info) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before voting on a review',
        403
      )
    }

    const userId = me.id
    const { reviewId, vote } = input

    return await services
      .fragrance
      .reviews
      .vote({ userId, reviewId, vote })
      .match(
        mapFragranceReviewRowToFragranceReviewSummary,
        error => {
          throw error
        }
      )
  }
}

export const mapFragranceReviewRowToFragranceReviewSummary = (row: FragranceReviewRow): FragranceReviewSummary => {
  const {
    id, fragranceId, userId,
    rating, reviewText,
    voteScore, likesCount, dislikesCount, myVote,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    fragranceId,
    userId,
    rating,
    text: reviewText,
    votes: {
      voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },
    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}
