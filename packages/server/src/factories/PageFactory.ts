import type { PageInfo } from '@src/graphql/gql-types.js'
import { CursorFactory } from './CursorFactory.js'
import type { db } from '@aromi/shared'

export interface BaseNode {
  id: string
}

export interface ConnectionEdge<N> {
  node: N
  cursor: string
}

export interface RelayConnection<N> {
  edges: Array<ConnectionEdge<N>>
  pageInfo: PageInfo
}

export class PageFactory<C> {
  private readonly cursorFactory = new CursorFactory()

  paginate<N extends BaseNode>(
    rows: N[],
    pagination: db.CursorPaginationInput<C>
  ): RelayConnection<N> {
    const { first, column, cursor } = pagination

    const hasPreviousPage = cursor.isValid
    const hasNextPage = rows.length > pagination.first
    const sliced = hasNextPage ? rows.slice(0, first) : rows

    const edges = sliced.map(row => ({
      node: row,
      cursor: this.cursorFactory.encodeCursor(row[column], row.id)
    }))

    const startCursor = edges.at(0)?.cursor ?? null
    const endCursor = edges.at(-1)?.cursor ?? null

    return {
      edges,
      pageInfo: {
        hasPreviousPage,
        hasNextPage,
        startCursor,
        endCursor
      }
    }
  }

  transform <N extends BaseNode, O>(
    connection: RelayConnection<N>,
    map: (node: N) => O
  ): RelayConnection<O> {
    const edges = connection
      .edges
      .map(({ node, cursor }) => ({ node: map(node), cursor }))

    return {
      edges,
      pageInfo: connection.pageInfo
    }
  }
}
