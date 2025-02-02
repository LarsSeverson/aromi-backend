import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { accords } from './fragrance/accords'
import { fragrance } from './fragrance/fragrance'
import { notes } from './fragrance/notes'
import { me } from './user/me'
import { images } from './fragrance/images'
import { traits } from './fragrance/traits'
import { myReactions } from './fragrance/myReactions'
import { fragrances } from './fragrance/fragrances'

export const Query = {
  fragrance,
  fragrances,

  me
}

export const FragranceQuery = {
  traits: (parent: Fragrance): Fragrance => { return parent },
  notes: (parent: Fragrance): Fragrance => { return parent },

  accords,
  images,

  myReactions
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
