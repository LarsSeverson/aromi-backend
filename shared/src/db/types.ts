export * from './db-schema'

export interface VoteInfoRow {
  targetId: string

  upvotes: number
  downvotes: number
  score: number
  userVote: number | null
}

export type PaginationOperator = '>' | '<'
export type PaginationDirection = 'asc' | 'desc'

export interface DBCursor<T> {
  value: T
  lastId: string | null
  isValid: boolean
}

export interface CursorPaginationInput<C> {
  first: number
  column: string

  operator: PaginationOperator
  direction: PaginationDirection

  cursor: DBCursor<C>
}
