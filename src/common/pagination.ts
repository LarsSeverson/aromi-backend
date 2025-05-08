import { SortBy, SortDirection, type PaginationInput, type InputMaybe, type SortByInput, type PageInfo } from '@src/generated/gql-types'
import { type NonNullableType } from './types'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 40

export const PAGINATION_OPERATORS = {
  [SortDirection.Ascending]: { valueOp: '>=', idOp: '>' },
  [SortDirection.Descending]: { valueOp: '<=', idOp: '<' }
} as const

export const PAGINATION_DIRECTIONS = {
  [SortDirection.Ascending]: 'asc',
  [SortDirection.Descending]: 'desc'
} as const

export interface NonNullablePaginationInput {
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
  sort: NonNullableType<SortByInput>
}

export const extractPaginationParams = (input?: InputMaybe<PaginationInput>): NonNullablePaginationInput => {
  const sort: NonNullablePaginationInput['sort'] = {
    by: input?.sort?.by ?? SortBy.CreatedAt,
    direction: input?.sort?.direction ?? SortDirection.Descending
  }

  return {
    first: Math.min((input?.first ?? DEFAULT_LIMIT), MAX_LIMIT),
    after: input?.after,
    sort
  }
}

export interface Page<T> { edges: T[], pageInfo: PageInfo }

export const newPage = <T extends { cursor: string }>(edges: T[], first: number, after: InputMaybe<string> | undefined): Page<T> => {
  const hasExtraRow = edges.length > first
  const trimmed = hasExtraRow ? edges.slice(0, first) : edges

  const startCursor = trimmed.at(0)?.cursor ?? null
  const endCursor = trimmed.at(-1)?.cursor ?? null

  const pageInfo: PageInfo = {
    hasNextPage: edges.length > first,
    hasPreviousPage: Boolean(after),
    startCursor,
    endCursor
  }

  return { edges: trimmed, pageInfo }
}
