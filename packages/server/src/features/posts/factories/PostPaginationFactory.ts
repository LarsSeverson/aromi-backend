import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type PostSortInput } from '@src/graphql/gql-types.js'

export class PostPaginationFactory extends CursorPaginationFactory<PostSortInput, string> {
  protected resolveSort (sort?: PostSortInput | null): CursorSortSpec<string> {
    switch (sort?.by) {
      default:
        return {
          column: 'createdAt',
          direction: sort?.direction ?? SortDirection.Descending,
          decoder: (v) => String(v)
        }
    }
  }
}