import { type PaginationInput, type SortBy, SortDirection, type VotePaginationInput, type VoteSortBy } from '@src/generated/gql-types'
import { CursorFactory, type CursorDecoder, type ApiCursor } from './CursorFactory'

export type PaginationInputs = PaginationInput | VotePaginationInput
export type SortBys = SortBy | VoteSortBy

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

export const PAGINATION_COLUMNS: Record<SortBys, string> = {
  ID: 'id',
  UPDATED: 'updatedAt',
  VOTES: 'voteScore'
} as const

export type PaginationOperator = typeof PAGINATION_OPERATORS[keyof typeof PAGINATION_OPERATORS]

export type PaginationDirection = typeof PAGINATION_DIRECTIONS[keyof typeof PAGINATION_DIRECTIONS]

export interface NonNullablePaginationInput {
  first: number
  after: string
  sort: {
    direction: SortDirection
    by: SortBys
  }
}

export interface NormalizedSortInput {
  by: SortBys
  direction: SortDirection
}

export interface NormalizedPaginationInput {
  first: number
  rawCursor: string
  sort: NormalizedSortInput
}

export interface ParsedPaginationInput<C = unknown> {
  first: number
  offset?: number

  column: string

  operator: PaginationOperator
  direction: PaginationDirection

  cursor: ApiCursor<C>

  normalized: NormalizedPaginationInput
}

export class PagiFactory {
  private readonly cursorFactory = new CursorFactory()

  decode <C>(
    parsed: ParsedPaginationInput<C>,
    value?: unknown
  ): ParsedPaginationInput<C> {
    const { normalized } = parsed
    const decoder = this.getDecoder<C>(normalized.sort)
    const decoded = decoder(value ?? parsed.cursor.value)
    parsed.cursor.value = decoded

    return parsed
  }

  parse (
    input: NormalizedPaginationInput
  ): ParsedPaginationInput {
    const { rawCursor, first, sort } = input

    const cursor = this.cursorFactory.decodeCursor(rawCursor)
    const offset = this.getOffset(cursor)
    const column = PAGINATION_COLUMNS[sort.by]
    const operator = PAGINATION_OPERATORS[sort.direction]
    const direction = PAGINATION_DIRECTIONS[sort.direction]

    return {
      first,
      offset,

      column,

      operator,
      direction,

      cursor,

      normalized: input
    }
  }

  normalize (
    input: PaginationInputs | null | undefined
  ): NormalizedPaginationInput {
    const { first, after, sort } = this.getDefaults(input)
    return { first, rawCursor: after, sort }
  }

  getDecoder <C>(
    sort: NormalizedSortInput
  ): CursorDecoder<C> {
    const by = sort.by
    const decoder = CURSOR_DECODERS[by]
    return decoder as CursorDecoder<C>
  }

  private getDefaults (
    input: PaginationInputs | null | undefined
  ): NonNullablePaginationInput {
    const first = Math.min(MAX_LIMIT, (input?.first ?? DEFAULT_LIMIT))
    const after = input?.after ?? ''
    const direction = input?.sort?.direction ?? 'DESCENDING'
    const by = input?.sort?.by ?? 'ID'

    const sort = { direction, by }

    return { first, after, sort }
  }

  private getOffset (cursor: ApiCursor<unknown>): number | undefined {
    if (!cursor.isValid) return
    if (typeof cursor.value !== 'string') return

    let offset: number | undefined
    const [, rawOffset] = cursor.value.split('|')
    const parsed = Number(rawOffset)
    if (Number.isInteger(parsed) && parsed >= 0) {
      offset = parsed
    }

    return offset
  }
}

export const CURSOR_DECODERS: Record<SortBys, (value: unknown) => unknown> = {
  ID: function (value: unknown): number {
    return Number(value)
  },
  UPDATED: function (value: unknown): string {
    return String(value)
  },
  VOTES: function (value: unknown): number {
    return Number(value)
  }
}
