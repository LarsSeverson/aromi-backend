import { SortBy } from '@src/generated/gql-types'

export const gqlSortMapping: Record<SortBy, string> = {
  [SortBy.Id]: 'id',
  [SortBy.Created]: 'dCreated',
  [SortBy.Updated]: 'dModified'
}

export const dbSortMapping: Record<SortBy, string> = {
  [SortBy.Id]: 'id',
  [SortBy.Created]: 'created_at',
  [SortBy.Updated]: 'updated_at'
}
