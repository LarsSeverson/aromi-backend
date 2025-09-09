import type { IUserSummary } from '../types.js'
import type { UserRow } from '@aromi/shared'

export const mapUserRowToUserSummary = (row: UserRow): IUserSummary => {
  return {
    ...row,
    avatarSrc: row.avatarUrl
  }
}
