import { CursorPaginationFactory, type CursorSortSpec } from '@src/server/factories/CursorPaginationFactory'
import { SortDirection, type RequestSortInput } from '@src/generated/gql-types'

export class RequestPaginationFactory extends CursorPaginationFactory<RequestSortInput, string> {
  protected resolveSort (sort?: RequestSortInput | null | undefined): CursorSortSpec<string> {
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
