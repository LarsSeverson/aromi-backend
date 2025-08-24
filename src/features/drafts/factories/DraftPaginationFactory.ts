import { PaginationFactory, type SortSpec } from '@src/factories/PaginationFactory'
import { SortDirection, type DraftSortInput } from '@src/generated/gql-types'

export class DraftPaginationFactory extends PaginationFactory<DraftSortInput, string> {
  protected resolveSort (sort?: DraftSortInput | null | undefined): SortSpec<string> {
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
