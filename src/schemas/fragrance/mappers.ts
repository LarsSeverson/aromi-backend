import { type FragranceReview, type Fragrance, type FragranceCollection, type FragranceCollectionItem } from '@src/generated/gql-types'
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

export type FragranceReviewSummary = Omit<FragranceReview, 'user' | 'fragrance'>
export type FragranceReviewSummaryEdge = ResolverEdge<FragranceReviewSummary>

export interface FragranceNotesSummary { parent: FragranceSummary }

export type FragranceCollectionSummary = Omit<FragranceCollection, 'user' | 'items'>
export type FragranceCollectionSummaryEdge = ResolverEdge<FragranceCollectionSummary>

export type FragranceCollectionItemSummary = Omit<FragranceCollectionItem, 'fragrance' | 'collection'> & { fragrance: FragranceSummary }
export type FragranceCollectionItemSummaryEdge = ResolverEdge<FragranceCollectionItemSummary>
