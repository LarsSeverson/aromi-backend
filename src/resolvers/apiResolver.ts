import { encodeCursor } from '@src/common/cursor'
import { newPage, type Page, type PaginationParams } from '@src/common/pagination'
import { type Audit, SortBy } from '@src/generated/gql-types'

export interface ResolverNode {
  id: number
  audit: Audit
}

export interface ResolverEdge<N extends ResolverNode = ResolverNode> {
  node: N
  cursor: string
}

export interface MapToPageParams<N extends ResolverNode, T = unknown> {
  rows: T[]
  paginationParams: PaginationParams
  mapFn: (row: T) => N
}

export class ApiResolver {
  protected mapToPage <N extends ResolverNode, T = unknown>(params: MapToPageParams<N, T>): Page<N> {
    const { rows, paginationParams, mapFn } = params
    const { first, cursor } = paginationParams

    const edges = rows.map(row => this.mapToEdge(mapFn(row), paginationParams))
    const page = newPage({ first, cursor, edges })

    return page
  }

  protected mapToEdge <N extends ResolverNode>(node: N, paginationParams: PaginationParams): ResolverEdge<N> {
    return { node, cursor: this.makeCursor(node, paginationParams) }
  }

  private makeCursor (node: ResolverNode, paginationParams: PaginationParams): string {
    const { sortParams } = paginationParams
    const { column } = sortParams

    const sortValue = column === SortBy.Id ? node.id : node.audit[column]

    return encodeCursor(sortValue, node.id)
  }
}
