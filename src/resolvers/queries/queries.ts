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
import { collectionFragrances } from './fragrance/collection-fragrances'
import { user } from './user/user'
import { userReviews } from './user/reviews'
import { userLikes } from './user/likes'
import { type QueryResolvers, type FragranceResolvers, type FragranceTraits, type FragranceNotes, type FragranceNotesResolvers, type FragranceTraitsResolvers, type UserResolvers, type FragranceCollectionResolvers } from '@src/generated/gql-types'

export const Query: QueryResolvers = {
  fragrance,
  fragrances,

  me,
  user
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

export const FragranceCollectionQuery: FragranceCollectionResolvers = {
  fragrances: collectionFragrances,
  user: (parent) => parent.user
}
