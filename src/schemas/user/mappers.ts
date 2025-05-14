import { type UserCollection, type User, type UserCollectionItem } from '@src/generated/gql-types'
import { type ResolverEdge } from '@src/resolvers/apiResolver'
import { type FragranceSummary } from '../fragrance/mappers'

export type UserSummary = Omit<User, 'collections' | 'likes' | 'reviews'>

export type UserCollectionSummary = Omit<UserCollection, 'user' | 'items'> & { user: UserSummary }
export type UserCollectionSummaryEdge = ResolverEdge<UserCollectionSummary>

export type UserCollectionItemSummary = Omit<UserCollectionItem, 'fragrance' | 'collection'> & { fragrance: FragranceSummary }
export type UserCollectionItemSummaryEdge = ResolverEdge<UserCollectionItemSummary>
