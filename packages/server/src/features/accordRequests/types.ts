import type { AccordRequest } from '@src/graphql/gql-types.js'

export interface IAccordRequestSummary extends Omit<AccordRequest, 'image' | 'user' | 'votes'> {}

export type AccordRequestLoadersKey = string
