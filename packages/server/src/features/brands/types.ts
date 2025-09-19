import type { Brand, BrandEdit } from '@src/graphql/gql-types.js'

export interface IBrandSummary extends Omit<Brand, 'avatar' | 'fragrances'> {}
export interface IBrandEditSummary extends Omit<BrandEdit, 'brand' | 'user' | 'reviewedBy' | 'propsedAvatar'> {
  brandId: string
  userId: string
  reviewedBy: string | null
  proposedAvatarId: string | null
}

export type BrandLoadersKey = string
