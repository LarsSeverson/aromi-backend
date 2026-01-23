import type { FragranceService } from '@aromi/shared'
import type { Fragrance, FragranceCollection, FragranceCollectionItem, FragranceEdit, FragranceImage, FragranceRequest, FragranceReview, FragranceVote } from '@src/graphql/gql-types.js'
import type z from 'zod'
import type { MoveFragranceCollectionItemsInputSchema, MoveFragranceCollectionsInputSchema } from './utils/validation.js'

export interface IFragranceSummary extends Omit<
  Fragrance,
  'brand' | 'images' | 'accords' | 'notes' | 'traits' | 'trait' | 'votes' | 'reviews' | 'reviewInfo'
 | 'myAccords' | 'myNotes' | 'myTraits' | 'myReview'
> {
  brandId: string
}

export interface IFragranceImageSummary extends FragranceImage {
  s3Key: string
}

export interface IFragranceEditSummary extends Omit<FragranceEdit, 'proposedBrand' | 'proposedImage' | 'fragrance' | 'user' | 'reviewer'> {
  fragranceId: string
  userId: string
  proposedBrandId: string | null
  proposedImageId: string | null
  reviewedBy: string | null
}

export interface IFragranceRequestSummary extends Omit<FragranceRequest, 'brand' | 'image' | 'user' | 'trait' | 'traits' | 'accords' | 'notes' | 'votes'> {
  assetId: string | null
  brandId: string | null
  userId: string
}

export interface IFragranceCollectionSummary extends Omit<FragranceCollection, 'user' | 'items' | 'previewItems' | 'hasFragrance' | 'info'> {
  userId: string
}

export interface IFragranceCollectionItemSummary extends Omit<FragranceCollectionItem, 'fragrance' | 'collection'> {
  collectionId: string
  fragranceId: string
}

export interface IFragranceReviewSummary extends Omit<FragranceReview, 'fragrance' | 'author' | 'votes'> {
  fragranceId: string
  userId: string
}

export interface IFragranceVoteSummary extends Omit<FragranceVote, 'fragrance' | 'user'> {
  fragranceId: string
  userId: string
}

export type FragranceLoadersKey = string
export type FragranceRequestLoadersKey = string

export interface InsertVoteParams {
  trx: FragranceService
  userId: string
  requestId: string
  vote: number
}

export interface UpdateVoteParams {
  trx: FragranceService
  userId: string
  requestId: string
  oldVote: number | null
  newVote: number
}

export type MoveFragranceCollectionItemsInputType = z.infer<typeof MoveFragranceCollectionItemsInputSchema>
export type MoveFragranceCollectionsInputType = z.infer<typeof MoveFragranceCollectionsInputSchema>