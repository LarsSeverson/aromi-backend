// import { type MutationResolvers, type FragranceCollectionResolvers as CollectionFieldResolvers, type QueryResolvers } from '@src/generated/gql-types'
// import { ApiResolver } from './apiResolver'
// import { type FragranceCollectionItemRow } from '@src/services/collectionService'
// import { ResultAsync } from 'neverthrow'
// import { type FragranceCollectionItemSummary } from '@src/schemas/fragrance/mappers'
// import { ApiError } from '@src/common/error'
// import { mapFragranceCollectionRowToFragranceCollectionSummary, mapUserRowToUserSummary } from './userResolver'

// export class CollectionResolver extends ApiResolver {
//   collection: QueryResolvers['collection'] = async (parent, args, context, info) => {
//     const { id } = args
//     const { services } = context

//     return await services
//       .collection
//       .find({ id })
//       .match(
//         mapFragranceCollectionRowToFragranceCollectionSummary,
//         error => { throw error }
//       )
//   }

//   collectionItems: CollectionFieldResolvers['items'] = async (parent, args, context, info) => {
//     const { id } = parent
//     const { input } = args
//     const { loaders } = context

//     const paginationParams = getPaginationParams(input)

//     return await ResultAsync
//       .fromPromise(
//         loaders
//           .collection
//           .getItemsLoader({ paginationParams })
//           .load({ collectionId: id }),
//         error => error
//       )
//       .match(
//         rows => this
//           .mapToPage({
//             rows,
//             paginationParams,
//             mapFn: mapCollectionItemRowToCollectionItemSummary
//           }),
//         error => { throw error }
//       )
//   }

//   collectionUser: CollectionFieldResolvers['user'] = async (parent, args, context, info) => {
//     const { id } = parent
//     const { loaders } = context

//     return await ResultAsync
//       .fromPromise(
//         loaders
//           .collection
//           .getUsersLoader()
//           .load({ collectionId: id }),
//         error => error
//       )
//       .match(
//         row => {
//           if (row == null) {
//             throw new ApiError(
//               'NOT_FOUND',
//               'User not found for this collection',
//               404,
//               'Collection loader returned a null user'
//             )
//           }

//           return mapUserRowToUserSummary(row)
//         },
//         error => { throw error }
//       )
//   }

//   createCollection: MutationResolvers['createFragranceCollection'] = async (_, args, context, info) => {
//     const { input } = args
//     const { services } = context

//     const { name } = input

//     return await services
//       .collection
//       .create({ name })
//       .match(
//         mapFragranceCollectionRowToFragranceCollectionSummary,
//         error => { throw error }
//       )
//   }

//   createCollectionItem: MutationResolvers['createFragranceCollectionItem'] = async (_, args, context, info) => {
//     const { input } = args
//     const { services } = context

//     const { fragranceId, collectionId } = input

//     return await services
//       .collection
//       .createItem({ fragranceId, collectionId })
//       .match(
//         mapCollectionItemRowToCollectionItemSummary,
//         error => { throw error }
//       )
//   }
// }

// export const mapCollectionItemRowToCollectionItemSummary = (row: FragranceCollectionItemRow): FragranceCollectionItemSummary => {
//   const {
//     id, fragranceId,
//     brand, name, rating, reviewsCount, rank,
//     voteScore, likesCount, dislikesCount, myVote,
//     createdAt, updatedAt, deletedAt,
//     fCreatedAt, fUpdatedAt, fDeletedAt
//   } = row

//   return {
//     id,
//     rank: Number(rank),
//     fragrance: {
//       id: fragranceId,
//       brand,
//       name,
//       rating: rating ?? 0.0,
//       reviewsCount,

//       votes: {
//         voteScore,
//         likesCount,
//         dislikesCount,
//         myVote: myVote === 1 ? true : myVote === -1 ? false : null
//       },

//       audit: ApiResolver.audit(fCreatedAt, fUpdatedAt, fDeletedAt)
//     },
//     audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
//   }
// }
