import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { accords } from './fragrance/accords'
import { fragrance } from './fragrance/fragrance'
import { notes } from './fragrance/notes'
import { me } from './user/me'
import { images } from './fragrance/images'
import { traits } from './fragrance/traits'

export const Query = {
  fragrance,

  me
}

export const FragranceQuery = {
  traits: (parent: Fragrance): Fragrance => { return parent },
  notes: (parent: Fragrance): Fragrance => { return parent },

  accords,
  images
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
