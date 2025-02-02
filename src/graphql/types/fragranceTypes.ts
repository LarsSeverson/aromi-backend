export enum NoteLayerType {
  TOP = 'top',
  MIDDLE = 'middle',
  BASE = 'base',
  FILL = 'fill'
}

export enum FragranceReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  REVIEW = 'review'
}

export enum FragranceTraitType {
  GENDER = 'gender',
  LONGEVITY = 'longevity',
  SILLAGE = 'sillage',
  COMPLEXITY = 'complexity',
  BALANCE = 'balance',
  ALLURE = 'allure'
}

export interface FragranceReactions {
  likes: number
  dislikes: number
  reviews: number
}

export interface FragranceTrait {
  trait: FragranceTraitType

  value: number
  myVote: number
}

export interface FragranceAccord {
  id: number

  name: string
  color: string

  votes: number

  myVote: boolean
}

export interface FragranceNote {
  id: number

  name: string
  layer: NoteLayerType

  votes: number

  myVote: boolean
}

export interface FragranceNotes {
  top: FragranceNote[]
  middle: FragranceNote[]
  base: FragranceNote[]
}

export interface FragranceImage {
  id: number

  url: string
}

export interface FragranceReaction {
  reaction: FragranceReactionType
}

export interface Fragrance {
  id: number

  brand: string
  name: string

  reactions: FragranceReactions

  traits: FragranceTrait[]

  accords: FragranceAccord[]
  notes: FragranceNote[]
  images: FragranceImage[]

  myReactions: FragranceReaction[]
}
