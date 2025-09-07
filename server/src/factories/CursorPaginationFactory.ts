import { type CursorDecoder, CursorFactory } from './CursorFactory'
import { SortDirection } from '@src/graphql/gql-types'
import { type PaginationDirection, type CursorPaginationInput, type PaginationOperator } from '@aromi/shared/db'

export const DEFAULT_LIMIT = 24
export const MAX_LIMIT = 44

export const PAGINATION_DIRECTIONS: Record<SortDirection, PaginationDirection> = {
  [SortDirection.Ascending]: 'asc',
  [SortDirection.Descending]: 'desc'
}

export const PAGINATION_OPERATORS: Record<SortDirection, PaginationOperator> = {
  [SortDirection.Ascending]: '>',
  [SortDirection.Descending]: '<'
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
