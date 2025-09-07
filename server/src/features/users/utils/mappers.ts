import { type IUserSummary } from '../types'
import { type UserRow } from '@aromi/shared/db'

export const mapUserRowToUserSummary = (row: UserRow): IUserSummary => {
  return {
    ...row,
    avatarSrc: row.avatarUrl
  }
}
