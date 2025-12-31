import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { type PostCommentSortInput, SortDirection } from '@src/graphql/gql-types.js'

export class PostCommentPaginationFactory extends CursorPaginationFactory<PostCommentSortInput, string> {
  protected resolveSort (sort?: PostCommentSortInput | null): CursorSortSpec<string> {
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