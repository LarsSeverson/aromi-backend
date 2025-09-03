import { PaginationFactory, type SortSpec } from '@src/server/factories/PaginationFactory'
import { SortDirection, type NoteSortInput } from '@src/generated/gql-types'

export class NotePaginationFactory extends PaginationFactory<NoteSortInput, string> {
  protected resolveSort (sort?: NoteSortInput | null | undefined): SortSpec<string> {
    switch (sort?.by) {
      default:
        return {
          column: 'createdAt',
          direction: sort?.direction ?? SortDirection.Descending,
          decoder: v => String(v)
        }
    }
  }
}
