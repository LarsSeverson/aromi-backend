import { SortBy, SortDirection, type VotePaginationInput, type PaginationInput, VoteSortBy, type InputMaybe, type SortByInput, type VoteSortByInput, type PageInfo } from '@src/generated/gql-types'
import { type NonNullableType } from './types'

export interface NonNullablePaginationInput {
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
  sortInput: NonNullableType<SortByInput>
}

export interface NonNullableVotePaginationInput {
  first: NonNullable<VotePaginationInput['first']>
  after: VotePaginationInput['after']
  sortInput: NonNullableType<VoteSortByInput>
}

export const getSortInput = (input?: InputMaybe<SortByInput>): NonNullableType<SortByInput> => {
  input = input ?? { by: SortBy.Modified, direction: undefined }
  return {
    by: input.by,
    direction: input?.direction ?? SortDirection.Desc
  }
}

export const getVoteSortInput = (input?: InputMaybe<VoteSortByInput>): NonNullableType<VoteSortByInput> => {
  input = input ?? { by: VoteSortBy.Votes, direction: undefined }
  return {
    by: input.by,
    direction: input?.direction ?? SortDirection.Desc
  }
}

export const isVoteSortByInput = (input?: SortByInput | VoteSortByInput): input is VoteSortByInput => {
  if (input == null) return false
  const voteSortValues = [VoteSortBy.Votes, VoteSortBy.Id, VoteSortBy.Created, VoteSortBy.Modified]
  return voteSortValues.includes(input.by as VoteSortBy)
}

export function getPaginationInput (input?: InputMaybe<PaginationInput>, maxLimit?: number): NonNullablePaginationInput
export function getPaginationInput (input?: InputMaybe<VotePaginationInput>, maxLimit?: number): NonNullableVotePaginationInput
export function getPaginationInput (input?: InputMaybe<PaginationInput | VotePaginationInput>, maxLimit: number = 30): NonNullablePaginationInput | NonNullableVotePaginationInput {
  input = input ?? {}

  if (input.sortBy != null && isVoteSortByInput(input.sortBy)) {
    const sortInput = getVoteSortInput(input.sortBy)

    return {
      first: Math.min((input.first ?? 20), maxLimit),
      after: input.after,
      sortInput
    }
  }

  const sortInput = getSortInput((input as PaginationInput).sortBy)
  return {
    first: Math.min((input.first ?? 20), maxLimit),
    after: input.after,
    sortInput
  }
}

export const getSortDirectionChar = (direction: SortDirection): string => {
  return direction === SortDirection.Asc ? '>' : '<'
}

export const getPageInfo = <T extends { cursor: string }>(edges: T[], first: number, after: InputMaybe<string> | undefined): PageInfo => {
  const startCursor = edges.at(0)?.cursor ?? null
  const endCursor = edges.at(-1)?.cursor ?? null

  return {
    hasNextPage: edges.length > first,
    hasPreviousPage: Boolean(after),
    startCursor,
    endCursor
  }
}
