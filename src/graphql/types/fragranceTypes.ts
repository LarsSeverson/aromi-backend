import { User } from './userTypes'

export enum NoteLayerType {
  TOP = 'top',
  MIDDLE = 'middle',
  BASE = 'base'
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
  accordId: number
  name: string
  color: string
  votes: number
  myVote: boolean
}

export interface FragranceNote {
  id: number
  noteId: number
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

export interface FragranceVote {
  id: number
  likes: number
  dislikes: number
  myVote: boolean | null
}

export interface FragranceReview {
  id: number
  rating: number
  review: string
  votes: number
  dCreated: Date
  dModified: Date
  dDeleted: Date | null

  user: User
  myVote: boolean | null
}

export interface FragranceReviewDistribution {
  one: number
  two: number
  three: number
  four: number
  five: number
}

export interface Fragrance {
  id: number
  brand: string
  name: string
  rating: number
  reviewsCount: number

  vote: FragranceVote

  traits: FragranceTraits

  notes: FragranceNotes
  accords: FragranceAccord[]
  images: FragranceImage[]
  reviews: FragranceReview[]
  reviewDistribution: FragranceReviewDistribution
}
