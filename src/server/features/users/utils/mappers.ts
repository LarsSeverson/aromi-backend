import { type IUserSummary, type UserRow } from '../types'

export const mapUserRowToUserSummary = (row: UserRow): IUserSummary => {
  return {
    ...row,
    avatarSrc: row.avatarUrl
  }
}
