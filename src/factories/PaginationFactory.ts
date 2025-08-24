import { ASCENDING_ORDER, DESCENDING_ORDER } from '@src/common/constants'
import { type CursorDecoder, type ApiCursor, CursorFactory } from './CursorFactory'
import { SortDirection } from '@src/generated/gql-types'

export const DEFAULT_LIMIT = 24
export const MAX_LIMIT = 44

export const PAGINATION_OPERATORS = {
  [SortDirection.Ascending]: '>',
  [SortDirection.Descending]: '<'
} as const

export const PAGINATION_DIRECTIONS = {
  [SortDirection.Ascending]: ASCENDING_ORDER,
  [SortDirection.Descending]: DESCENDING_ORDER
} as const

export type PaginationOperator = typeof PAGINATION_OPERATORS[keyof typeof PAGINATION_OPERATORS]

export type PaginationDirection = typeof PAGINATION_DIRECTIONS[keyof typeof PAGINATION_DIRECTIONS]

export interface PaginationInput<C> {
  first: number
  column: string

  operator: PaginationOperator
  direction: PaginationDirection

  cursor: ApiCursor<C>
}

export interface SortSpec<C> {
  column: string
  direction: SortDirection
  decoder?: CursorDecoder<C>
}

export interface NormalizedInput<C> {
  first: number
  after: string
  sort: SortSpec<C>
}

export interface RawArgs<S> {
  first?: number | null
  after?: string | null
  sort?: S | null
}

export abstract class PaginationFactory<S, C> {
  protected cursorFactory: CursorFactory = new CursorFactory()

  protected clampFirst (num?: number | null): number {
    const val = Math.max(1, Math.min(MAX_LIMIT, num ?? DEFAULT_LIMIT))
    return val
  }

  protected abstract resolveSort (sort?: S | null): SortSpec<C>

  normalize (raw?: RawArgs<S> | null): NormalizedInput<C> {
    const first = this.clampFirst(raw?.first)
    const after = raw?.after ?? ''
    const sort = this.resolveSort(raw?.sort)

    return { first, after, sort }
  }

  parse (raw?: RawArgs<S> | null): PaginationInput<C> {
    const {
      first,
      after,
      sort: {
        direction,
        column,
        decoder
      }
    } = this.normalize(raw)

    const cursor = this
      .cursorFactory
      .decodeCursor<C>(after, decoder)

    return {
      first,
      column,
      operator: PAGINATION_OPERATORS[direction],
      direction: PAGINATION_DIRECTIONS[direction],
      cursor
    }
  }
}
