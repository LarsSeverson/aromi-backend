import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type FragranceSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class FragrancePaginationFactory extends CursorPaginationFactory<FragranceSortInput, string> {
  protected resolveSort (sort?: FragranceSortInput | null): CursorSortSpec<string> {
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
