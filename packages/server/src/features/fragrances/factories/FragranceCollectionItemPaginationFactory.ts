import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type FragranceCollectionItemSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class FragranceCollectionItemPaginationFactory extends CursorPaginationFactory<FragranceCollectionItemSortInput, number> {
  protected resolveSort (sort?: FragranceCollectionItemSortInput | null): CursorSortSpec<number> {
    switch (sort?.by) {
      default:
        return {
          column: 'rank',
          direction: sort?.direction ?? SortDirection.Descending,
          decoder: v => Number(v)
        }
    }
  }
}