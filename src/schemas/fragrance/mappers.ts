import { type ConnectionEdge } from '@src/factories/ConnectionFactory'
import { type FragranceReview, type Fragrance, type FragranceCollection, type FragranceCollectionItem, type FragranceVote, type FragranceReport, type ReviewReport } from '@src/generated/gql-types'

export type FragranceSummary = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'fillerAccords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>

export type FragranceSummaryEdge = ConnectionEdge<FragranceSummary>

export type FragranceReviewSummary = Omit<FragranceReview, 'user' | 'fragrance'> & {
  userId: number
  fragranceId: number
}
export type FragranceReviewSummaryEdge = ConnectionEdge<FragranceReviewSummary>

export interface FragranceNotesSummary { parent: FragranceSummary }

export type FragranceCollectionSummary = Omit<FragranceCollection, 'user' | 'items' | 'hasFragrance'> & { userId: number }
export type FragranceCollectionSummaryEdge = ConnectionEdge<FragranceCollectionSummary>

export type FragranceCollectionItemSummary = Omit<FragranceCollectionItem, 'fragrance' | 'collection'> & { fragranceId: number }
export type FragranceCollectionItemSummaryEdge = ConnectionEdge<FragranceCollectionItemSummary>

export type FragranceVoteSummary = Omit<FragranceVote, 'fragrance' | 'user'> & {
  userId: number
  fragranceId: number
}
export type FragranceVoteSummaryEdge = ConnectionEdge<FragranceVoteSummary>

export type FragranceReportSummary = Omit<FragranceReport, 'fragrance' | 'user'>
export type ReviewReportSummary = Omit<ReviewReport, 'review' | 'user'>
