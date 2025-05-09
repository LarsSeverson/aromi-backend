import { type FragranceReview, type Fragrance, type FragranceEdge, type FragranceReviewEdge } from '@src/generated/gql-types'

export type FragranceSummary = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>

export type FragranceSummaryEdge = Omit<FragranceEdge, 'node'> & { node: FragranceSummary }

export type FragranceReviewSummary = Omit<FragranceReview, 'user'>
export type FragranceReviewSummaryEdge = Omit<FragranceReviewEdge, 'node'> & { node: FragranceReviewSummary }
