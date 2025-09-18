import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type AccordEditSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class AccordEditPaginationFactory extends CursorPaginationFactory<AccordEditSortInput, string> {
  protected resolveSort (sort?: AccordEditSortInput | null): CursorSortSpec<string> {
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
