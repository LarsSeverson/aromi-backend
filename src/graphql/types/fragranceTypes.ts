export interface FragranceAccord {
  fragranceId: number
  accordId: number
  name: string
  color: string
  votes: number
}

export type FragranceAccords = FragranceAccord[]

export interface FragranceNote {
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

  accords?: FragranceAccords
  notes?: FragranceNotes
  images?: FragranceImages
}

export type Fragrances = Fragrance[]

export enum NoteLayer {
  TOP = 'top',
  MIDDLE = 'middle',
  BASE = 'base',
  FILL = 'fill'
}
