import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type FragranceVoteSortInput } from '@src/graphql/gql-types.js'

export class UserLikesPaginationFactory extends CursorPaginationFactory<FragranceVoteSortInput, string> {
  protected resolveSort (sort?: FragranceVoteSortInput | null): CursorSortSpec<string> {
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