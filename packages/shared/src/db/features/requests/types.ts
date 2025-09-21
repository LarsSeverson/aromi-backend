import type { DB, RequestStatus } from '@src/db/db-schema.js'
import type { Selectable } from 'kysely'

export type RequestJobRow = Selectable<DB['requestJobs']>

export interface SomeRequestRow {
  id: string
  userId: string
  requestStatus: RequestStatus
  assetId: string | null
}

export interface SomeRequestVoteRow {
  requestId: string
  userId: string
  vote: number
}

export interface SomeRequestScoreRow {
  requestId: string
  upvotes: number
  downvotes: number
  score: number
}
