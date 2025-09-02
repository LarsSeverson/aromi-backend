import { type DB } from '@src/db/schema'
import { type User } from '@src/generated/gql-types'
import { type Selectable } from 'kysely'

export type UserRow = Selectable<DB['users']>

export interface IUserSummary extends
  Omit<User, 'brandRequests' | 'fragranceRequests'> {}
