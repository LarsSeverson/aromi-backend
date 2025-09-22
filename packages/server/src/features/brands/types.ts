import type { Brand, BrandEdit, BrandRequest } from '@src/graphql/gql-types.js'

export interface IBrandSummary extends Omit<Brand, 'avatar' | 'fragrances' | 'votes'> {}

export interface IBrandEditSummary extends Omit<BrandEdit, 'brand' | 'user' | 'reviewedBy' | 'propsedAvatar'> {
  brandId: string
  userId: string
  reviewedBy: string | null
  proposedAvatarId: string | null
}

export interface IBrandRequestSummary extends Omit<BrandRequest, 'image' | 'user' | 'votes'> {
  assetId: string | null
  userId: string
}

export type BrandLoadersKey = string
export type BrandRequestLoadersKey = string
