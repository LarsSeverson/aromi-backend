import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type BrandEditSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class BrandEditPaginationFactory extends CursorPaginationFactory<BrandEditSortInput, string> {
  protected resolveSort (sort?: BrandEditSortInput | null): CursorSortSpec<string> {
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
