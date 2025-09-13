import type { Generated, Kysely, Selectable } from 'kysely'
import type { DB, Timestamp } from './db-schema.js'

export type DBConnection = Kysely<DB>

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

export interface QueryOptions<C> {
  pagination?: CursorPaginationInput<C>
}

export type RowOf<T extends keyof DB> = Selectable<DB[T]>

export type ServicableTableName = {
  [K in keyof DB]: DB[K] extends { id: Generated<string>, deletedAt: Timestamp | null } ? K : never
}[keyof DB]

export type ServicableTablesMatching<R> = {
  [K in ServicableTableName]: Selectable<DB[K]> extends R ? K : never
}[ServicableTableName]

export type TablesMatching<R> = {
  [K in keyof DB]: Selectable<DB[K]> extends R ? K : never
}[keyof DB]