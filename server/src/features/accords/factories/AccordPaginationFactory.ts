import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory'
import { SortDirection, type AccordSortInput } from '@src/graphql/gql-types'

export class AccordPaginationFactory extends CursorPaginationFactory<AccordSortInput, string> {
  protected resolveSort (sort?: AccordSortInput | null | undefined): CursorSortSpec<string> {
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
