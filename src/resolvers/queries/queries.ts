import { accordById, accordByLikeName } from './accords'
import { noteById, noteByLikeName } from './notes'
import { accords } from './fragrance/accords'
import { fragrance } from './fragrance/fragrance'
import { notes } from './fragrance/notes'
import { me } from './user/me'
import { images } from './fragrance/images'
import { traits } from './fragrance/traits'
import { fragrances } from './fragrance/fragrances'
import { reviews } from './fragrance/reviews'
import { myReview } from './fragrance/my-review'
import { reviewDistribution } from './fragrance/review-distribution'
import { collections } from './user/collections'
import { collectionItems } from './fragrance/collection-items'
import { user } from './user/user'
import { userReviews } from './user/reviews'
import { userLikes } from './user/likes'
import { noteRequest } from './request/note'
import { accordRequest } from './request/accord'
import { type QueryResolvers, type FragranceResolvers, type FragranceTraits, type FragranceNotes, type FragranceNotesResolvers, type FragranceTraitsResolvers, type UserResolvers, type FragranceCollectionResolvers, type FragranceReviewResolvers } from '@src/generated/gql-types'
import { reviewFragrance } from './review/fragrance'
import { reviewUser } from './review/user'
import { collection } from './collection/collection'
import { collectionUser } from './collection/user'

export const Query: QueryResolvers = {
  fragrance,
  fragrances,

  collection,

  me,
  user,

  accordById,
  accordByLikeName,
  noteById,
  noteByLikeName,

  noteRequest,
  accordRequest
}

export const FragranceQuery: FragranceResolvers = {
  traits: (parent) => ({ fragranceId: parent.id } as unknown as FragranceTraits),
  notes: (parent) => ({ fragranceId: parent.id } as unknown as FragranceNotes),

  accords,
  images,
  reviews,
  myReview,
  reviewDistribution
}

export const FragranceNotesQuery: FragranceNotesResolvers = {
  top: notes,
  middle: notes,
  base: notes
}

export const FragranceTraitsQuery: FragranceTraitsResolvers = {
  gender: traits,
  longevity: traits,
  sillage: traits,
  complexity: traits,
  balance: traits,
  allure: traits
}

export const UserQuery: UserResolvers = {
  collections,
  reviews: userReviews,
  likes: userLikes
}

export const FragranceReviewQuery: FragranceReviewResolvers = {
  fragrance: reviewFragrance,
  user: reviewUser
}

export const FragranceCollectionQuery: FragranceCollectionResolvers = {
  items: collectionItems,
  user: collectionUser
}
