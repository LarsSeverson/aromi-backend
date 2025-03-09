import { SortBy, VoteSortBy } from '@src/generated/gql-types'

export const gqlSortMapping: Record<SortBy, string> = {
  [SortBy.Id]: 'id',
  [SortBy.Created]: 'dCreated',
  [SortBy.Modified]: 'dModified'
}

export const dbSortMapping: Record<SortBy, string> = {
  [SortBy.Id]: 'id',
  [SortBy.Created]: 'created_at',
  [SortBy.Modified]: 'updated_at'
}

export const gqlVoteSortMapping: Record<VoteSortBy, string> = {
  [VoteSortBy.Id]: 'id',
  [VoteSortBy.Created]: 'dCreated',
  [VoteSortBy.Modified]: 'dModified',
  [VoteSortBy.Votes]: 'votes'
}

export const dbVoteSortMapping: Record<VoteSortBy, string> = {
  [VoteSortBy.Id]: 'id',
  [VoteSortBy.Created]: 'created_at',
  [VoteSortBy.Modified]: 'updated_at',
  [VoteSortBy.Votes]: 'votes'
}

export interface GetSortColumnsReturn<T extends SortBy | VoteSortBy> {
  gqlColumn: T extends SortBy
    ? (typeof gqlSortMapping)[T & SortBy]
    : (typeof gqlVoteSortMapping)[T & VoteSortBy]
  dbColumn: T extends SortBy
    ? (typeof dbSortMapping)[T & SortBy]
    : (typeof dbVoteSortMapping)[T & VoteSortBy]
}

export function getSortColumns (by: SortBy): GetSortColumnsReturn<SortBy>
export function getSortColumns (by: VoteSortBy): GetSortColumnsReturn<VoteSortBy>
export function getSortColumns (by: SortBy | VoteSortBy): GetSortColumnsReturn<SortBy | VoteSortBy> {
  if (by in gqlVoteSortMapping) {
    return {
      gqlColumn: gqlVoteSortMapping[by as VoteSortBy],
      dbColumn: dbVoteSortMapping[by as VoteSortBy]
    }
  }
  return {
    gqlColumn: gqlSortMapping[by as SortBy],
    dbColumn: dbSortMapping[by as SortBy]
  }
}
