import { SortBy, SortDirection, type PaginationInput, type VotePaginationInput } from '@src/generated/gql-types'
import { type CursorTypes, type ApiCursor, parseCursor } from './cursor'
import { type SortColumn } from './types'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 40

const DEFAULT_DIRECTION = SortDirection.Descending
const DEFAULT_SORT_BY = SortBy.UpdatedAt

export const PAGINATION_OPERATORS = {
  [SortDirection.Ascending]: '>',
  [SortDirection.Descending]: '<'
} as const

export const PAGINATION_DIRECTIONS = {
  [SortDirection.Ascending]: 'asc',
  [SortDirection.Descending]: 'desc'
} as const

export type PaginationOperator = typeof PAGINATION_OPERATORS[keyof typeof PAGINATION_OPERATORS]
export type PaginationDirection = typeof PAGINATION_DIRECTIONS[keyof typeof PAGINATION_DIRECTIONS]

export interface SortParams<C extends SortColumn = SortBy> {
  column: C
  operator: PaginationOperator
  direction: PaginationDirection
}

export interface PaginationParams<C extends SortColumn = SortBy> {
  first: number
  cursor: ApiCursor<CursorTypes[C]>
  sortParams: SortParams<C>
}

export const getPaginationParams = <C extends SortColumn = SortBy>(
  input?: PaginationInput | VotePaginationInput | null
): PaginationParams<C> => {
  const first = Math.min(MAX_LIMIT, (input?.first ?? DEFAULT_LIMIT))
  const column = (input?.sort?.by ?? DEFAULT_SORT_BY) as C
  const operator = PAGINATION_OPERATORS[input?.sort?.direction ?? DEFAULT_DIRECTION]
  const direction = PAGINATION_DIRECTIONS[input?.sort?.direction ?? DEFAULT_DIRECTION]
  const cursor = parseCursor(input?.after ?? '', column)

  return {
    first,
    cursor,
    sortParams: {
      column,
      operator,
      direction
    }
  }
}
