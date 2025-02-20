import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { accords } from './fragrance/accords'
import { fragrance } from './fragrance/fragrance'
import { notes } from './fragrance/notes'
import { me } from './user/me'
import { images } from './fragrance/images'
import { traits } from './fragrance/traits'
import { fragrances } from './fragrance/fragrances'
import { reviews } from './fragrance/reviews'
import { myReview } from './fragrance/myReview'
import { reviewDistribution } from './fragrance/reviewDistribution'

export const Query = {
  fragrance,
  fragrances,

  me
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
