import { CursorPaginationFactory, type CursorSortSpec } from '@src/factories/CursorPaginationFactory.js'
import { SortDirection, type UserFollowSortInput } from '@src/graphql/gql-types.js'

export class UserFollowPaginationFactory extends CursorPaginationFactory<UserFollowSortInput, string> {
  protected resolveSort (sort?: UserFollowSortInput | null): CursorSortSpec<string> {
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