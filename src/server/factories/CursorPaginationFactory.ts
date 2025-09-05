import { PAGINATION_DIRECTIONS, PAGINATION_OPERATORS, type PaginationDirection, type PaginationOperator } from '@src/utils/util-types'
import { type CursorDecoder, type ApiCursor, CursorFactory } from './CursorFactory'
import { type SortDirection } from '@generated/gql-types'

export const DEFAULT_LIMIT = 24
export const MAX_LIMIT = 44

export interface CursorPaginationInput<C> {
  first: number
  column: string

  operator: PaginationOperator
  direction: PaginationDirection

  cursor: ApiCursor<C>
}

export interface CursorSortSpec<C> {
  column: string
  direction: SortDirection
  decoder?: CursorDecoder<C>
}

export interface NormalizedCursorInput<C> {
  first: number
  after: string
  sort: CursorSortSpec<C>
}

export interface RawCursorPaginationArgs<S> {
  first?: number | null
  after?: string | null
  sort?: S | null
}

export abstract class CursorPaginationFactory<S, C> {
  protected cursorFactory: CursorFactory = new CursorFactory()

  protected clampFirst (num?: number | null): number {
    const val = Math.max(1, Math.min(MAX_LIMIT, num ?? DEFAULT_LIMIT))
    return val
  }

  protected abstract resolveSort (sort?: S | null): CursorSortSpec<C>

  normalize (raw?: RawCursorPaginationArgs<S> | null): NormalizedCursorInput<C> {
    const first = this.clampFirst(raw?.first)
    const after = raw?.after ?? ''
    const sort = this.resolveSort(raw?.sort)

    return { first, after, sort }
  }

  parse (raw?: RawCursorPaginationArgs<S> | null): CursorPaginationInput<C> {
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
