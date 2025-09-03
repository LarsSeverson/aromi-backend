import { PaginationFactory, type SortSpec } from '@src/server/factories/PaginationFactory'
import { SortDirection, type RequestSortInput } from '@src/generated/gql-types'

export class RequestPaginationFactory extends PaginationFactory<RequestSortInput, string> {
  protected resolveSort (sort?: RequestSortInput | null | undefined): SortSpec<string> {
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
