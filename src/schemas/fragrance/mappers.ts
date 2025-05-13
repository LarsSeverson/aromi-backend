import { type FragranceReview, type Fragrance } from '@src/generated/gql-types'
import { type ResolverEdge } from '@src/resolvers/apiResolver'

export type FragranceSummary = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>

export type FragranceSummaryEdge = ResolverEdge<FragranceSummary>

export type FragranceReviewSummary = Omit<FragranceReview, 'user'>
export type FragranceReviewSummaryEdge = ResolverEdge<FragranceReviewSummary>

export interface FragranceNotesSummary { parent: FragranceSummary }
