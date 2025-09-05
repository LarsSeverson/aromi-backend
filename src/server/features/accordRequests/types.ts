import { type AccordRequest } from '@generated/gql-types'

export interface IAccordRequestSummary extends Omit<AccordRequest, 'image' | 'user' | 'votes'> {}

export type AccordRequestLoadersKey = string
