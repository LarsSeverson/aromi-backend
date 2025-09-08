import { type SearchSortInput, SortDirection } from '@src/graphql/gql-types'
import { OffsetPaginationFactory, type OffsetSortSpec } from '@src/factories/OffsetPaginationFactory'

export class SearchPaginationFactory extends OffsetPaginationFactory<SearchSortInput> {
  protected resolveSort (sort?: SearchSortInput | null | undefined): OffsetSortSpec {
    return {
      column: undefined,
      direction: sort?.direction ?? SortDirection.Descending
    }
  }
}
