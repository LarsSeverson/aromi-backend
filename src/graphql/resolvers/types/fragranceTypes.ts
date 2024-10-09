export interface Fragrance {
  id: number
  brand: string
  name: string
  rating: number
  reviewCount: number
  likes: number
  dislikes: number
  gender: number
  longevity: number
  sillage: number
  complexity: number
  balance: number
  allure: number
}

export type Fragrances = Fragrance[]

export interface FragranceAccord {
  fragranceID: number
  accordID: number
  name: string
  concentration: number
}

export type FragranceAccords = FragranceAccord[]

export interface FragranceNote {
  fragranceID: number
  noteID: number
  name: string
  type: string
  concentration: number
}

export type FragranceNotes = FragranceNote[]
