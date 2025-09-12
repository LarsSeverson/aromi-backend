import type { RequestStatus } from '@src/db/db-schema.js'

export interface SomeRequestRow {
  id: string
  requestStatus: RequestStatus
}

export interface SomeRequestVoteRow {
  requestId: string
  userId: string
  vote: number
}

export interface SomeRequestVoteCountRow {
  requestId: string
  upvotes: number
  downvotes: number
}
