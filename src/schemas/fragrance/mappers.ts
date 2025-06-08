import { type ConnectionEdge } from '@src/factories/ConnectionFactory'
import { type FragranceReview, type Fragrance, type FragranceCollection, type FragranceCollectionItem } from '@src/generated/gql-types'

export type FragranceSummary = Omit<Fragrance,
'traits' |
'notes' |
'accords' |
'images' |
'reviews' |
'reviewDistribution' |
'myReview'>

export type FragranceSummaryEdge = ConnectionEdge<FragranceSummary>

export type FragranceReviewSummary = Omit<FragranceReview, 'user' | 'fragrance'>
export type FragranceReviewSummaryEdge = ConnectionEdge<FragranceReviewSummary>

export interface FragranceNotesSummary { parent: FragranceSummary }

export type FragranceCollectionSummary = Omit<FragranceCollection, 'user' | 'items'>
export type FragranceCollectionSummaryEdge = ConnectionEdge<FragranceCollectionSummary>

export type FragranceCollectionItemSummary = Omit<FragranceCollectionItem, 'fragrance' | 'collection'> & { fragrance: FragranceSummary }
export type FragranceCollectionItemSummaryEdge = ConnectionEdge<FragranceCollectionItemSummary>
