import { type SearchSortInput, SortDirection } from '@src/graphql/gql-types.js'
import { OffsetPaginationFactory, type OffsetSortSpec } from '@src/factories/OffsetPaginationFactory.js'

export class SearchPaginationFactory extends OffsetPaginationFactory<SearchSortInput> {
  protected resolveSort (sort?: SearchSortInput | null): OffsetSortSpec {
    return {
      direction: sort?.direction ?? SortDirection.Descending
    }
  }
}
