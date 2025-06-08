import { type User, type FragranceReview } from '@src/generated/gql-types'
import { type Override } from '@src/common/types'
import { type ConnectionEdge } from '@src/factories/ConnectionFactory'

export type UserSummary = Omit<User, 'collections' | 'likes' | 'reviews'>

export type UserReviewSummary = Override<FragranceReview, { user: UserSummary }>
export type UserReviewSummaryEdge = ConnectionEdge<UserReviewSummary>
