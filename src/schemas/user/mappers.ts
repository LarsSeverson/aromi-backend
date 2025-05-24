import { type User, type FragranceReview } from '@src/generated/gql-types'
import { type ResolverEdge } from '@src/resolvers/apiResolver'
import { type Override } from '@src/common/types'

export type UserSummary = Omit<User, 'collections' | 'likes' | 'reviews'>

export type UserReviewSummary = Override<FragranceReview, { user: UserSummary }>
export type UserReviewSummaryEdge = ResolverEdge<UserReviewSummary>
