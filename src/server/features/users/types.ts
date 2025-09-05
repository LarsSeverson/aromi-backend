import { type User } from '@generated/gql-types'

export interface IUserSummary extends
  Omit<User, 'brandRequests' | 'fragranceRequests'> {}
