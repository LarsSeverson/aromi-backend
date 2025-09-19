import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type FragranceEditSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class FragranceEditPaginationFactory extends CursorPaginationFactory<FragranceEditSortInput, string> {
  protected resolveSort (sort?: FragranceEditSortInput | null): CursorSortSpec<string> {
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
