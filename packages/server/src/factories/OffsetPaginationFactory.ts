import type { SortDirection } from '@src/graphql/gql-types.js'

export const DEFAULT_LIMIT = 24
export const MAX_LIMIT = 44

export interface OffsetPaginationInput {
  first: number
  offset: number
  direction: SortDirection
}

export interface OffsetSortSpec {
  direction: SortDirection
}

export interface NormalizedOffsetInput {
  first: number
  offset: number
  sort: OffsetSortSpec
}

export interface RawOffsetPaginationArgs<S> {
  first?: number | null
  after?: number | null
  sort?: S | null
}

export abstract class OffsetPaginationFactory<S> {
  protected clampFirst (num?: number | null): number {
    return Math.max(1, Math.min(MAX_LIMIT, num ?? DEFAULT_LIMIT))
  }

  protected clampOffset (num?: number | null): number {
    return Math.max(0, (num == null ? 0 : num + 1))
  }

  protected abstract resolveSort (sort?: S | null): OffsetSortSpec

  normalize (raw?: RawOffsetPaginationArgs<S> | null): NormalizedOffsetInput {
    const first = this.clampFirst(raw?.first)
    const offset = this.clampOffset(raw?.after)
    const sort = this.resolveSort(raw?.sort)

    return { first, offset, sort }
  }

  parse (raw?: RawOffsetPaginationArgs<S> | null): OffsetPaginationInput {
    const {
      first,
      offset,
      sort: { direction }
    } = this.normalize(raw)

    return {
      first,
      offset,
      direction
    }
  }
}
