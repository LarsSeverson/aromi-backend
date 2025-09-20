import type { AccordEdit, AccordRequest } from '@src/graphql/gql-types.js'

export interface IAccordEditSummary extends Omit<AccordEdit, 'accord' | 'user' | 'reviewer'> {
  accordId: string
  userId: string
  reviewedBy: string | null
}
export interface IAccordRequestSummary extends Omit<AccordRequest, 'image' | 'user' | 'votes'> {
  assetId: string | null
  userId: string
}

export type AccordRequestLoadersKey = string
