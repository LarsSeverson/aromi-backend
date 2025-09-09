import type { User } from '@src/graphql/gql-types.js'

export interface IUserSummary extends
  Omit<User, 'brandRequests' | 'fragranceRequests'> {}
