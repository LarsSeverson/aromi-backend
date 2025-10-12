import type { User } from '@src/graphql/gql-types.js'

export interface IUserSummary extends
  Omit<User, 'avatar' | 'fragranceRequests' | 'brandRequests' | 'accordRequests' | 'noteRequests' | 'collections' | 'collection' | 'reviews' | 'review'> {
  avatarId: string| null
}
