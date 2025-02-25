import { Fragrance } from '@src/graphql/types/fragranceTypes'
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

export const Query = {
  fragrance,
  fragrances,

  me,
  user
}

export const FragranceQuery = {
  traits: (parent: Fragrance): Fragrance => parent,
  notes: (parent: Fragrance): Fragrance => parent,

  accords,
  images,
  reviews,
  myReview,
  reviewDistribution
}

export const FragranceNotesQuery = {
  top: notes,
  middle: notes,
  base: notes
}

export const FragranceTraitsQuery = {
  gender: traits,
  longevity: traits,
  sillage: traits,
  complexity: traits,
  balance: traits,
  allure: traits
}

export const UserQuery = {
  collections
}

export const FragranceCollectionQuery = {
  fragrances: collectionFragrances,
  user
}
