import { type PageInfo } from '@src/generated/gql-types'

export interface ConnectionNode {
  id: number
}

export interface ConnectionEdge<N extends ConnectionNode = ConnectionNode> {
  node: N
  cursor: string
}

export interface RelayConnection<N extends ConnectionNode = ConnectionNode> {
  edges: Array<ConnectionEdge<N>>
  pageInfo: PageInfo
}

export class ConnectionFactory {
  newConnection <N extends ConnectionNode>(
    edges: Array<ConnectionEdge<N>>,
    pageInfo: PageInfo
  ): RelayConnection<N> {
    return { edges, pageInfo }
  }

  newEdge <N extends ConnectionNode>(
    node: N,
    cursor: string
  ): ConnectionEdge<N> {
    return { node, cursor }
  }

  newPageInfo (
    hasPreviousPage: boolean,
    hasNextPage: boolean,
    startCursor: string | null,
    endCursor: string | null
  ): PageInfo {
    return { hasPreviousPage, hasNextPage, startCursor, endCursor }
  }
}
