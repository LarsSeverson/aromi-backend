import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type FragranceNoteSortInput, SortDirection } from '@src/graphql/gql-types.js'

export type FNCursorType = string

export class FNPaginationFactory extends CursorPaginationFactory<FragranceNoteSortInput, FNCursorType> {
  protected resolveSort (sort?: FragranceNoteSortInput | null): CursorSortSpec<FNCursorType> {
    switch (sort?.by) {
      default:
        return {
          column: 'score',
          direction: sort?.direction ?? SortDirection.Descending,
          decoder: v => String(v)
        }
    }
  }
}
