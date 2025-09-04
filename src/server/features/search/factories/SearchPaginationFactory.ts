import { type SearchSortInput, SortDirection } from '@src/generated/gql-types'
import { OffsetPaginationFactory, type OffsetSortSpec } from '@src/server/factories/OffsetPaginationFactory'

export class SearchPaginationFactory extends OffsetPaginationFactory<SearchSortInput> {
  protected resolveSort (sort?: SearchSortInput | null | undefined): OffsetSortSpec {
    return {
      column: undefined,
      direction: sort?.direction ?? SortDirection.Descending
    }
  }
}
