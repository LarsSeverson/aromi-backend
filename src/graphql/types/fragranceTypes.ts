export interface FragranceAccord {
  id: number,
  fragranceId: number
  accordId: number
  name: string
  color: string
  votes: number
}

export type FragranceAccords = FragranceAccord[]

export interface FragranceNote {
  id: number,
  fragranceId: number
  noteId: number
  name: string
  layer: string
  votes: number
}

export type FragranceNotes = FragranceNote[]

export interface FragranceImage {
  imageId: number
  s3Key: string
}

export type FragranceImages = FragranceImage[]

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

  accords?: FragranceAccords | undefined
  notes?: FragranceNotes | undefined
  images?: FragranceImages | undefined
}

export type Fragrances = Fragrance[]

export enum NoteLayer {
  TOP = 'top',
  MIDDLE = 'middle',
  BASE = 'base',
  FILL = 'fill'
}

export enum FragranceTraitType {
  GENDER = 'gender',
  LONGEVITY = 'longevity',
  SILLAGE = 'sillage',
  COMPLEXITY = 'complexity',
  BALANCE = 'balance',
  ALLURE = 'allure'
}

export interface FragranceTrait {
  id: number
  fragranceTraitId: number
  averageValue: number

  trait: string
}

export interface FragranceTraitVote {
  id: number
  fragranceId: number
  fragranceTraitId: number
  userId: number
  value: number

  trait: string
}
