import type { UserRow } from '@src/db/index.js'

export interface UserDoc extends Omit<UserRow, 'email' | 'cognitoSub'> {
  id: string
  username: string
}

export interface FromUserRowParams {
  user: UserRow
}