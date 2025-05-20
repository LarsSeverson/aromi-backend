import { type UserCollection, type User, type UserCollectionItem, type FragranceReview } from '@src/generated/gql-types'
import { type ResolverEdge } from '@src/resolvers/apiResolver'
import { type FragranceSummary } from '../fragrance/mappers'
import { type Override } from '@src/common/types'

export type UserSummary = Omit<User, 'collections' | 'likes' | 'reviews'>

export type UserCollectionSummary = Omit<UserCollection, 'user' | 'items'> & { user: UserSummary }
export type UserCollectionSummaryEdge = ResolverEdge<UserCollectionSummary>

export type UserCollectionItemSummary = Omit<UserCollectionItem, 'fragrance' | 'collection'> & { fragrance: FragranceSummary }
export type UserCollectionItemSummaryEdge = ResolverEdge<UserCollectionItemSummary>

export type UserReviewSummary = Override<FragranceReview, { user: UserSummary }>
export type UserReviewSummaryEdge = ResolverEdge<UserReviewSummary>
