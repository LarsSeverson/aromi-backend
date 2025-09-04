import { CursorPaginationFactory, type CursorSortSpec } from '@src/server/factories/CursorPaginationFactory'
import { type BrandSortInput, SortDirection } from '@src/generated/gql-types'

export class BrandPaginationFactory extends CursorPaginationFactory<BrandSortInput, string> {
  protected resolveSort (sort?: BrandSortInput | null | undefined): CursorSortSpec<string> {
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
