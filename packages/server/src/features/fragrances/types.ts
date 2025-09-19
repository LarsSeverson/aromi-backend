import type { Fragrance, FragranceEdit } from '@src/graphql/gql-types.js'

export interface IFragranceSummary extends Omit<Fragrance, 'brand' | 'images' | 'accords' | 'notes' | 'traits' | 'trait'> {
  brandId: string
}

export interface IFragranceEditSummary extends Omit<FragranceEdit, 'proposedBrand' | 'proposedImage' | 'fragrance' | 'user' | 'reviewer'> {
  fragranceId: string
  userId: string
  proposedBrandId: string | null
  proposedImageId: string | null
  reviewedBy: string | null
}

export type FragranceLoadersKey = string
