import { SortDirection, type SearchSortInput } from '@src/generated/gql-types'
import { PaginationFactory, type SortSpec } from '@src/server/factories/PaginationFactory'

export class SearchPaginationFactory extends PaginationFactory<SearchSortInput, number> {
  protected resolveSort (sort?: SearchSortInput | null | undefined): SortSpec<number> {
    switch (sort?.by) {
      default:
        return {
          column: '_score',
          direction: SortDirection.Descending,
          decoder: v => Number(v)
        }
    }
  }
}
