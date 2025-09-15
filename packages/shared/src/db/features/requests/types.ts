import type { AssetStatus, RequestStatus } from '@src/db/db-schema.js'

export interface SomeRequestRow {
  id: string
  userId: string
  requestStatus: RequestStatus
}

export interface SomeRequestImageRow {
  id: string
  requestId: string
  s3Key: string
  name: string
  contentType: string
  sizeBytes: string | number
  status: AssetStatus
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
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
