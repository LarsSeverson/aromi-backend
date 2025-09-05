import { type IUserSummary } from '../types'
import { type UserRow } from '@src/db'

export const mapUserRowToUserSummary = (row: UserRow): IUserSummary => {
  return {
    ...row,
    avatarSrc: row.avatarUrl
  }
}
