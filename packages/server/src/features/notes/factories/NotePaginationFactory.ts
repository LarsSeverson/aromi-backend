import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type NoteSortInput } from '@src/graphql/gql-types.js'

export class NotePaginationFactory extends CursorPaginationFactory<NoteSortInput, string> {
  protected resolveSort (sort?: NoteSortInput | null): CursorSortSpec<string> {
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
