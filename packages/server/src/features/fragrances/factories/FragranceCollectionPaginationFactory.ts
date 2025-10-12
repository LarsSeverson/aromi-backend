import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type FragranceCollectionSortInput } from '@src/graphql/gql-types.js'

export class FragranceCollectionPaginationFactory extends CursorPaginationFactory<FragranceCollectionSortInput, string> {
  protected resolveSort (sort?: FragranceCollectionSortInput | null): CursorSortSpec<string> {
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