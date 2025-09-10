import type { FragranceRequestService } from '@aromi/shared'
import type { FragranceRequest } from '@src/graphql/gql-types.js'

export interface IFragranceRequestSummary extends
  Omit<FragranceRequest, 'brand' | 'image' | 'user' | 'trait' | 'traits' | 'accords' | 'notes' | 'votes'> {
  brandId: string | null
}

export type FragranceRequestLoadersKey = string

export interface InsertVoteParams {
  trx: FragranceRequestService
  userId: string
  requestId: string
  vote: number
}

export interface UpdateVoteParams {
  trx: FragranceRequestService
  userId: string
  requestId: string
  oldVote: number | null
  newVote: number
}