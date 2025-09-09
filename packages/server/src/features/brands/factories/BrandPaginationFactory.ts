import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type BrandSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class BrandPaginationFactory extends CursorPaginationFactory<BrandSortInput, string> {
  protected resolveSort (sort?: BrandSortInput | null): CursorSortSpec<string> {
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
