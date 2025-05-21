import { type FragranceReviewResolvers as FragranceReviewFieldResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { ResultAsync } from 'neverthrow'
import { mapUserRowToUserSummary } from './userResolver'
import { ApiError } from '@src/common/error'

export class ReviewResolver extends ApiResolver {
  reviewUser: FragranceReviewFieldResolvers['user'] = async (parent, args, context, info) => {
    const { id } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .review
          .getUsersLoader()
          .load({ reviewId: id }),
        error => error
      )
      .match(
        row => {
          if (row == null) throw new ApiError('NOT_FOUND', 'User not found for this review', 404, 'Review loader returned a null user')
          return mapUserRowToUserSummary(row)
        },
        error => { throw error }
      )
  }
}
