import { type InputMaybe, SortDirection } from '@src/generated/gql-types'
import { CursorFactory, type CursorParser, type ApiCursor } from './CursorFactory'

export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 40

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

export interface PaginationParams<C, T extends string = string> {
  first: number
  column: T
  operator: PaginationOperator
  direction: PaginationDirection
  cursor: ApiCursor<C>
}

export interface BasePaginationInput {
  first?: InputMaybe<number>
  after?: InputMaybe<string>
  sort?: InputMaybe<{ direction?: SortDirection }>
}

export interface NormalizedSortInput<T> {
  by: T
  direction: SortDirection
}

export interface NormalizedPaginationInput<C, S> {
  first: number
  cursor: ApiCursor<C>
  sort: NormalizedSortInput<S>
}

export type ExtractColumnFn<I, T extends string> = (input: I) => T

export class PaginationFactory {
  private readonly cursorFactory = new CursorFactory()

  newPaginationParams <C, T extends string>(
    first: number,
    column: T,
    operator: PaginationOperator,
    direction: PaginationDirection,
    cursor: ApiCursor<C>
  ): PaginationParams<C, T> {
    return { first, column, operator, direction, cursor }
  }

  parse <C, I, T extends string>(
    input: NormalizedPaginationInput<C, I>,
    extractColumnFn: ExtractColumnFn<typeof input, T>
  ): PaginationParams<C, T> {
    const { first, sort, cursor } = input
    const operator = PAGINATION_OPERATORS[sort.direction]
    const direction = PAGINATION_DIRECTIONS[sort.direction]
    const column = extractColumnFn(input)

    return this.newPaginationParams(first, column, operator, direction, cursor)
  }

  normalize <C, T>(
    input: BasePaginationInput | null | undefined,
    by: T,
    cursorParser?: CursorParser<C>
  ): NormalizedPaginationInput<C, T> {
    const { first, after, sort: { direction } } = this.getUniversalDefaults(input)
    const cursor = this.cursorFactory.decodeCursor(after, cursorParser)
    const sort = { by, direction }

    return { first, cursor, sort }
  }

  private getUniversalDefaults (
    input: BasePaginationInput | null | undefined
  ): GetDefaultPaginationInputOutput {
    const first = Math.min(MAX_LIMIT, (input?.first ?? DEFAULT_LIMIT))
    const after = input?.after ?? ''
    const direction = input?.sort?.direction ?? 'DESCENDING'
    const sort = { direction }

    return { first, after, sort }
  }
}

export interface GetDefaultPaginationInputOutput {
  first: number
  after: string
  sort: { direction: SortDirection }
}
