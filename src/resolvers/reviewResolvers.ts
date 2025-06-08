// import { type MutationResolvers, type FragranceReviewResolvers as FragranceReviewFieldResolvers } from '@src/generated/gql-types'
// import { ApiResolver } from './apiResolver'
// import { ResultAsync } from 'neverthrow'
// import { mapFragranceReviewRowToFragranceReviewSummary, mapUserRowToUserSummary } from './userResolver'
// import { ApiError } from '@src/common/error'
// import { mapFragranceRowToFragranceSummary } from './fragranceResolver'

// export class ReviewResolver extends ApiResolver {
//   reviewUser: FragranceReviewFieldResolvers['user'] = async (parent, args, context, info) => {
//     const { id } = parent
//     const { loaders } = context

//     return await ResultAsync
//       .fromPromise(
//         loaders
//           .review
//           .getUsersLoader()
//           .load({ reviewId: id }),
//         error => error
//       )
//       .match(
//         row => {
//           if (row == null) {
//             throw new ApiError(
//               'NOT_FOUND',
//               'User not found for this review',
//               404,
//               'Review loader returned a null user'
//             )
//           }
//           return mapUserRowToUserSummary(row)
//         },
//         error => { throw error }
//       )
//   }

//   reviewFragrance: FragranceReviewFieldResolvers['fragrance'] = async (parent, args, context, info) => {
//     const { id } = parent
//     const { loaders } = context

//     return await ResultAsync
//       .fromPromise(
//         loaders
//           .review
//           .getFragrancesLoader()
//           .load({ reviewId: id }),
//         error => error
//       )
//       .match(
//         row => {
//           if (row == null) {
//             throw new ApiError(
//               'NOT_FOUND',
//               'Fragrance not found for this review',
//               404,
//               'Review loader returned a null fragrance'
//             )
//           }
//           return mapFragranceRowToFragranceSummary(row)
//         },
//         error => { throw error }
//       )
//   }

//   createReview: MutationResolvers['createFragranceReview'] = async (_, args, context, info) => {
//     const { input } = args
//     const { services } = context

//     const { fragranceId, rating, review } = input

//     return await services
//       .review
//       .create({ fragranceId, rating, reviewText: review })
//       .match(
//         mapFragranceReviewRowToFragranceReviewSummary,
//         error => { throw error }
//       )
//   }

//   voteOnReview: MutationResolvers['voteOnReview'] = async (_, args, context, info) => {
//     const { input } = args
//     const { services } = context

//     const { reviewId, vote } = input

//     return await services
//       .review
//       .vote({ reviewId, vote: vote ?? null })
//       .match(
//         mapFragranceReviewRowToFragranceReviewSummary,
//         error => { throw error }
//       )
//   }
// }
