export enum NoteLayerType {
  TOP = 'top',
  MIDDLE = 'middle',
  BASE = 'base'
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

export interface FragranceImage {
  id: number
  url: string
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

export interface FragranceTrait {
  trait: FragranceTraitType
  value: number
  myVote: number
}

export interface FragranceTraits {
  gender: FragranceTrait
  longevity: FragranceTrait
  sillage: FragranceTrait
  complexity: FragranceTrait
  balance: FragranceTrait
  allure: FragranceTrait
}

export interface MyFragranceReactions {
  like: boolean
  dislike: boolean
}

export interface FragranceReactions {
  likes: number
  dislikes: number
  reviews: number
}

export interface FragranceReaction {
  reaction: FragranceReactionType
  myReaction: boolean
}

export interface Fragrance {
  id: number
  brand: string
  name: string

  reactions: FragranceReactions

  traits: FragranceTrait[]

  notes: FragranceNotes
  accords: FragranceAccord[]
  images: FragranceImage[]

  myReactions: MyFragranceReactions
}
