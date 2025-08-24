import { PaginationFactory, type SortSpec } from '@src/factories/PaginationFactory'
import { SortDirection, type AccordSortInput } from '@src/generated/gql-types'

export class AccordPaginationFactory extends PaginationFactory<AccordSortInput, string> {
  protected resolveSort (sort?: AccordSortInput | null | undefined): SortSpec<string> {
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
