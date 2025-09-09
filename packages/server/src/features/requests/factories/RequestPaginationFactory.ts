import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type RequestSortInput } from '@src/graphql/gql-types.js'

export class RequestPaginationFactory extends CursorPaginationFactory<RequestSortInput, string> {
  protected resolveSort (sort?: RequestSortInput | null): CursorSortSpec<string> {
    switch (sort?.by) {
      default:
        return {
          column: 'updatedAt',
          direction: sort?.direction ?? SortDirection.Descending,
          decoder: v => String(v)
        }
    }
  }
}
