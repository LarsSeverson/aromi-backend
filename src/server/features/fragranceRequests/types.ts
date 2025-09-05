import { type FragranceRequest } from '@generated/gql-types'

export interface IFragranceRequestSummary extends
  Omit<FragranceRequest, 'brand' | 'image' | 'user' | 'trait' | 'traits' | 'accords' | 'notes' | 'votes'> {
  brandId: string | null
}

export type FragranceRequestLoadersKey = string
