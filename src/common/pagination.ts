import { SortBy, SortDirection, type PaginationInput, type InputMaybe, type PageInfo } from '@src/generated/gql-types'
import { parseCursor, type ApiCursor } from './cursor'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 40

const DEFAULT_DIRECTION = SortDirection.Descending
const DEFAULT_SORT_BY = SortBy.UpdatedAt

export const PAGINATION_OPERATORS = {
  [SortDirection.Ascending]: '>',
  [SortDirection.Descending]: '<'
} as const

export type PaginationOperator = typeof PAGINATION_OPERATORS[keyof typeof PAGINATION_OPERATORS]

export const PAGINATION_DIRECTIONS = {
  [SortDirection.Ascending]: 'asc',
  [SortDirection.Descending]: 'desc'
} as const

export type PaginationDirection = typeof PAGINATION_DIRECTIONS[keyof typeof PAGINATION_DIRECTIONS]

export interface SortParams {
  column: SortBy
  operator: PaginationOperator
  direction: PaginationDirection
}

export interface PaginationParams {
  first: number
  cursor: ApiCursor
  sortParams: SortParams
}

export const extractPaginationParams = (input?: InputMaybe<PaginationInput>): PaginationParams => {
  const first = Math.min(MAX_LIMIT, (input?.first ?? DEFAULT_LIMIT))
  const column = input?.sort?.by ?? DEFAULT_SORT_BY
  const operators = PAGINATION_OPERATORS[input?.sort?.direction ?? DEFAULT_DIRECTION]
  const direction = PAGINATION_DIRECTIONS[input?.sort?.direction ?? DEFAULT_DIRECTION]
  const cursor = parseCursor(input?.after ?? '', column)

  return {
    first,
    cursor,
    sortParams: {
      column,
      operator: operators,
      direction
    }
  }
}

export interface PageEdge<Node> { cursor: string, node: Node }
export interface Page<Node> { edges: Array<PageEdge<Node>>, pageInfo: PageInfo }

export interface NewPageParams<Node> {
  first: number
  cursor: ApiCursor
  edges: Array<PageEdge<Node>>
}

export const newPage = <Node>(params: NewPageParams<Node>): Page<Node> => {
  const { first, cursor, edges } = params

  const hasExtraRow = edges.length > first
  const trimmed = hasExtraRow ? edges.slice(0, first) : edges

  const startCursor = trimmed.at(0)?.cursor ?? null
  const endCursor = trimmed.at(-1)?.cursor ?? null

  return {
    edges: trimmed,
    pageInfo: {
      hasNextPage: hasExtraRow,
      hasPreviousPage: cursor.isValid,
      startCursor,
      endCursor
    }
  }
}
