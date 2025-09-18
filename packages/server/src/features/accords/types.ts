import type { AccordEdit } from '@src/graphql/gql-types.js'

export interface IAccordEditSummary extends Omit<AccordEdit, 'accord' | 'user' | 'reviewer'> {
  accordId: string
  userId: string
  reviewedBy: string | null
}