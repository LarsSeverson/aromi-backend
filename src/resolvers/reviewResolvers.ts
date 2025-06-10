import { type FragranceReviewResolvers as FragranceReviewFieldResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { ResultAsync } from 'neverthrow'
import { mapUserRowToUserSummary } from './userResolver'
import { mapFragranceRowToFragranceSummary } from './fragranceResolver'
import { type FragranceReviewRow } from '@src/services/repositories/FragranceReviewsRepo'
import { type FragranceReviewSummary } from '@src/schemas/fragrance/mappers'

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

  // createReview: MutationResolvers['createFragranceReview'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context

  //   const { fragranceId, rating, review } = input

  //   return await services
  //     .review
  //     .create({ fragranceId, rating, reviewText: review })
  //     .match(
  //       mapFragranceReviewRowToFragranceReviewSummary,
  //       error => { throw error }
  //     )
  // }

  // voteOnReview: MutationResolvers['voteOnReview'] = async (_, args, context, info) => {
  //   const { input } = args
  //   const { services } = context

  //   const { reviewId, vote } = input

  //   return await services
  //     .review
  //     .vote({ reviewId, vote: vote ?? null })
  //     .match(
  //       mapFragranceReviewRowToFragranceReviewSummary,
  //       error => { throw error }
  //     )
  // }
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
