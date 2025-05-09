import { type Fragrance, type FragranceEdge } from '@src/generated/gql-types'

export type FragranceSummary = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>

export type FragranceSummaryEdge = Omit<FragranceEdge, 'node'> & { node: FragranceSummary }
