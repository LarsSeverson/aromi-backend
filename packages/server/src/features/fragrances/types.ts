import type { FragranceService } from '@aromi/shared'
import type { Fragrance, FragranceEdit, FragranceRequest } from '@src/graphql/gql-types.js'

export interface IFragranceSummary extends Omit<Fragrance, 'brand' | 'images' | 'accords' | 'notes' | 'traits' | 'trait' | 'votes'> {
  brandId: string
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
