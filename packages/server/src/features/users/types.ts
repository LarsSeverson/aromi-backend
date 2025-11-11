import type { User } from '@src/graphql/gql-types.js'

export interface IUserSummary extends
  Omit<User, 'avatar' | 'fragranceRequests' | 'brandRequests' | 'accordRequests' | 'noteRequests' | 'collections' | 'collection' | 'likes' | 'reviews' | 'review'> {
  avatarId: string| null
}
