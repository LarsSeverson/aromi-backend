import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type NoteEditSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class NoteEditPaginationFactory extends CursorPaginationFactory<NoteEditSortInput, string> {
  protected resolveSort (sort?: NoteEditSortInput | null): CursorSortSpec<string> {
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
