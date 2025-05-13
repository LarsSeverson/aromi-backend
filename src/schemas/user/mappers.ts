import { type UserCollection, type User } from '@src/generated/gql-types'
import { type ResolverEdge } from '@src/resolvers/apiResolver'

export type UserSummary = Omit<User,
'collections' |
'likes' |
'reviews'
>

export type UserCollectionSummary = Omit<UserCollection, 'user' | 'items'>
export type UserCollectionSummaryEdge = ResolverEdge<UserCollectionSummary>
