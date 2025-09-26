import type { OffsetPaginationInput } from '@src/factories/OffsetPaginationFactory.js'
import type { SearchPageInfo } from '@src/graphql/gql-types.js'

export interface SearchEdge<T> {
  node: T
  offset: number
}

export interface SearchConnection<T> {
  edges: Array<SearchEdge<T>>
  pageInfo: SearchPageInfo
}

export class SearchPageFactory {
  paginate<T> (
    nodes: T[],
    pagination: OffsetPaginationInput
  ): SearchConnection<T> {
    const { first, offset } = pagination

    const hasPreviousPage = offset > 0
    const hasNextPage = nodes.length > first
    const sliced = hasNextPage ? nodes.slice(0, first) : nodes

    const edges = sliced.map((node, index) => ({
      node,
      offset: offset + index
    }))

    const startOffset = edges.at(0)?.offset ?? 0
    const endOffset = edges.at(-1)?.offset ?? 0
    const pageSize = edges.length

    return {
      edges,
      pageInfo: {
        hasPreviousPage,
        hasNextPage,
        startOffset,
        endOffset,
        pageSize
      }
    }
  }
}