import { type SortDirection } from '@generated/gql-types'

export const DEFAULT_LIMIT = 24
export const MAX_LIMIT = 44

export interface OffsetPaginationInput {
  first: number
  offset: number
  column?: string
  direction: SortDirection
}

export interface OffsetSortSpec {
  column?: string
  direction: SortDirection
}

export interface NormalizedOffsetInput {
  first: number
  offset: number
  sort: OffsetSortSpec
}

export interface RawOffsetPaginationArgs<S> {
  first?: number | null
  offset?: number | null
  sort?: S | null
}

export abstract class OffsetPaginationFactory<S> {
  protected clampFirst (num?: number | null): number {
    return Math.max(1, Math.min(MAX_LIMIT, num ?? DEFAULT_LIMIT))
  }

  protected clampOffset (num?: number | null): number {
    return Math.max(0, num ?? 0)
  }

  protected abstract resolveSort (sort?: S | null): OffsetSortSpec

  normalize (raw?: RawOffsetPaginationArgs<S> | null): NormalizedOffsetInput {
    const first = this.clampFirst(raw?.first)
    const offset = this.clampOffset(raw?.offset)
    const sort = this.resolveSort(raw?.sort)

    return { first, offset, sort }
  }

  parse (raw?: RawOffsetPaginationArgs<S> | null): OffsetPaginationInput {
    const {
      first,
      offset,
      sort: { column, direction }
    } = this.normalize(raw)

    return {
      first,
      offset,
      column,
      direction
    }
  }
}
