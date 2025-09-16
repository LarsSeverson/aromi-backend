import type { Fragrance } from '@src/graphql/gql-types.js'

export interface IFragranceSummary extends Omit<Fragrance, 'brand' | 'images' | 'accords' | 'notes' | 'traits' | 'trait'> {
  brandId: string
}

export type FragranceLoadersKey = string