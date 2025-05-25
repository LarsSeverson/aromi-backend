import { type ApiCursor, encodeCursor } from '@src/common/cursor'
import { type PaginationParams } from '@src/common/pagination'
import { type SortColumn } from '@src/common/types'
import { type PageInfo, type Audit, type SortBy } from '@src/generated/gql-types'

export interface ResolverNode {
  id: number
  audit: Audit
}

export interface ResolverEdge<N extends ResolverNode = ResolverNode> {
  node: N
  cursor: string
}

export interface MapToPageParams<N extends ResolverNode, T = unknown, C extends SortColumn = SortBy> {
  rows: T[]
  mapFn: (row: T) => N
  paginationParams: PaginationParams<C>
}

interface Page<N extends ResolverNode = ResolverNode> {
  edges: Array<ResolverEdge<N>>
  pageInfo: PageInfo
}

interface NewPageParams<N extends ResolverNode = ResolverNode> {
  first: number
  cursor: ApiCursor
  edges: Array<ResolverEdge<N>>
}

export class ApiResolver {
  protected mapToPage <N extends ResolverNode, T = unknown, C extends SortColumn = SortBy>(
    params: MapToPageParams<N, T, C>
  ): Page<N> {
    const { rows, paginationParams, mapFn } = params
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapToEdge(row, mapFn, paginationParams))
    const page = this.newPage({ first, cursor, edges })

    return page
  }

  protected mapToEdge <N extends ResolverNode, T = unknown, C extends SortColumn = SortBy>(
    row: T,
    mapFn: (row: T) => N,
    paginationParams: PaginationParams<C>
  ): ResolverEdge<N> {
    return { node: mapFn(row), cursor: this.makeCursor(row, paginationParams) }
  }

  private makeCursor <T = unknown, C extends SortColumn = SortBy>(
    row: T,
    paginationParams: PaginationParams<C>
  ): string {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const parsedRow = row as Record<string, unknown>

    const sortValue = parsedRow[column]
    const id = String(parsedRow.id)

    return encodeCursor(sortValue, id)
  }

  private newPage <N extends ResolverNode>(params: NewPageParams<N>): Page<N> {
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
}
