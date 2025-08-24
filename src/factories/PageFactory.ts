import { type PageInfo } from '@src/generated/gql-types'
import { type PaginationInput } from './PaginationFactory'
import { CursorFactory } from './CursorFactory'

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

export interface Page<N> {
  connection: RelayConnection<N>
}

export class PageFactory<C> {
  private readonly cursorFactory = new CursorFactory()

  paginate<N extends BaseNode>(
    rows: N[],
    pagination: PaginationInput<C>
  ): Page<N> {
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
      connection: {
        edges,
        pageInfo: {
          hasPreviousPage,
          hasNextPage,
          startCursor,
          endCursor
        }
      }
    }
  }

  transform <N extends BaseNode, O>(
    page: Page<N>,
    map: (node: N) => O
  ): Page<O> {
    const edges = page
      .connection
      .edges
      .map(({ node, cursor }) => ({ node: map(node), cursor }))

    return {
      connection: {
        edges,
        pageInfo: page.connection.pageInfo
      }
    }
  }
}
