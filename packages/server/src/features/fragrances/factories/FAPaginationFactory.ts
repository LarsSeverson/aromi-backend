import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type FragranceAccordSortInput, SortDirection } from '@src/graphql/gql-types.js'

export type FACursorType = string

export class FAPaginationFactory extends CursorPaginationFactory<FragranceAccordSortInput, FACursorType> {
  protected resolveSort (sort?: FragranceAccordSortInput | null): CursorSortSpec<FACursorType> {
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
