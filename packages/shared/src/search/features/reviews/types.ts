import type { FragranceReviewRow, UserRow } from '@src/db/index.js'

export interface ReviewDocUser {
  id: string
  username: string
}

export interface ReviewDoc extends FragranceReviewRow {
  user: ReviewDocUser
}

export interface ReviewFromRowParams {
  review: FragranceReviewRow
  user: UserRow
}