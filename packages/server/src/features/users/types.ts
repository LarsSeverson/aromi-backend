import { type User } from '@src/graphql/gql-types'

export interface IUserSummary extends
  Omit<User, 'brandRequests' | 'fragranceRequests'> {}
