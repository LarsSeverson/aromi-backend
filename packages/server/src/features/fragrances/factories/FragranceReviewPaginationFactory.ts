import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type FragranceReviewSortInput } from '@src/graphql/gql-types.js'

export class FragranceReviewPaginationFactory extends CursorPaginationFactory<FragranceReviewSortInput, string> {
  protected resolveSort (sort?: FragranceReviewSortInput | null): CursorSortSpec<string> {
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