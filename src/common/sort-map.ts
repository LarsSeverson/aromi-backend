import { SortBy } from '@src/generated/gql-types'

export const gqlSortMapping: Record<SortBy, string> = {
  [SortBy.Id]: 'id',
  [SortBy.Created]: 'dCreated',
  [SortBy.Modified]: 'dModified',
  [SortBy.Votes]: 'votes',
  [SortBy.Added]: 'dAdded'
}

export const dbSortMapping: Record<SortBy, string> = {
  [SortBy.Id]: 'id',
  [SortBy.Created]: 'created_at',
  [SortBy.Modified]: 'updated_at',
  [SortBy.Votes]: 'votes',
  [SortBy.Added]: 'created_at'
}

export interface GetSortColumnsReturn {
  gqlColumn: typeof gqlSortMapping[keyof typeof gqlSortMapping]
  dbColumn: typeof dbSortMapping[keyof typeof dbSortMapping]
}

export function getSortColumns (by: SortBy): GetSortColumnsReturn {
  return {
    gqlColumn: gqlSortMapping[by],
    dbColumn: dbSortMapping[by]
  }
}
