import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory'
import { SortDirection, type NoteSortInput } from '@src/graphql/gql-types'

export class NotePaginationFactory extends CursorPaginationFactory<NoteSortInput, string> {
  protected resolveSort (sort?: NoteSortInput | null | undefined): CursorSortSpec<string> {
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
