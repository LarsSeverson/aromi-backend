import { type BrandRequest } from '@generated/gql-types'

export interface IBrandRequestSummary extends Omit<BrandRequest, 'image' | 'user' | 'votes'> { }

export type BrandRequestLoadersKey = string
