import type { BrandRequest } from '@src/graphql/gql-types.js'

export interface IBrandRequestSummary extends Omit<BrandRequest, 'image' | 'user' | 'votes'> { }

export type BrandRequestLoadersKey = string
