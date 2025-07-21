import { type ApiCursor, CursorFactory } from '@src/factories/CursorFactory'
import { ConnectionFactory, type ConnectionNode, type ConnectionEdge, type RelayConnection } from '@src/factories/ConnectionFactory'
import { type Audit, SortBy, VoteSortBy } from '@src/generated/gql-types'
import { PaginationFactory } from '@src/factories/PagiFactory'

export type TransformDataFn<N extends ConnectionNode> = (d: N) => N
export type ExtractCursorValueFn<N extends ConnectionNode> = (d: N, idx: number) => string

export interface NewPageInput<C> {
  first: number
  cursor: ApiCursor<C>
}

export class ApiResolver {
  protected readonly cursorFactory = new CursorFactory()
  protected readonly connectionFactory = new ConnectionFactory()
  protected readonly paginationFactory = new PaginationFactory()

  protected newEdges <N extends ConnectionNode, O extends ConnectionNode = N>(
    data: N[],
    extractCursorValueFn: ExtractCursorValueFn<N>,
    transform?: (d: N) => O
  ): Array<ConnectionEdge<O>> {
    return data
      .map((d, i) => {
        const value = extractCursorValueFn(d, i)
        const id = String(d.id)
        const cursor = this.cursorFactory.encodeCursor(value, id)
        const node = transform != null ? transform(d) : d
        return this.connectionFactory.newEdge(node as O, cursor)
      })
  }

  protected newPage <N extends ConnectionNode, C, O extends ConnectionNode = N>(
    data: N[],
    input: NewPageInput<C>,
    extractCursorValueFn: ExtractCursorValueFn<N>,
    transform?: (d: N) => O
  ): RelayConnection<O> {
    const { first, cursor: lastCursor } = input
    const edges = this.newEdges(data, extractCursorValueFn, transform)

    const hasExtraEdge = edges.length > first
    const trimmed = hasExtraEdge ? edges.slice(0, first) : edges

    const startCursor = trimmed.at(0)?.cursor ?? null
    const endCursor = trimmed.at(-1)?.cursor ?? null

    const pageInfo = this
      .connectionFactory
      .newPageInfo(
        lastCursor.isValid,
        hasExtraEdge,
        startCursor,
        endCursor
      )

    return this
      .connectionFactory
      .newConnection(
        trimmed,
        pageInfo
      )
  }

  protected getVoteMutationValues (
    vote: boolean | null | undefined
  ): { voteValue: number, deletedAt: string | null } {
    const voteValue = vote == null ? 0 : vote ? 1 : -1
    const deletedAt = vote == null ? new Date().toISOString() : null
    return { voteValue, deletedAt }
  }

  static audit (
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null
  ): Audit {
    return {
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      deletedAt: deletedAt == null ? deletedAt : new Date(deletedAt)
    }
  }
}

export const SortByColumn = {
  [SortBy.Updated]: 'updatedAt'
} as const

export const VoteSortByColumn = {
  [VoteSortBy.Updated]: 'updatedAt',
  [VoteSortBy.Votes]: 'voteScore'
} as const

export const FILLER_FLAG = 'filler'
