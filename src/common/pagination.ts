import { SortBy, SortDirection, type PaginationInput, type InputMaybe, type SortByInput, type PageInfo } from '@src/generated/gql-types'
import { type NonNullableType } from './types'

export interface NonNullablePaginationInput {
  first: NonNullable<PaginationInput['first']>
  after: PaginationInput['after']
  sort: NonNullableType<SortByInput>
}

export const getSortInput = (input?: InputMaybe<SortByInput>): NonNullableType<SortByInput> => {
  input = input ?? { by: SortBy.Modified, direction: undefined }
  return {
    by: input.by,
    direction: input?.direction ?? SortDirection.Desc
  }
}

export function getPaginationInput (input?: InputMaybe<PaginationInput>, maxLimit: number = 30): NonNullablePaginationInput {
  input = input ?? {}

  const sort = getSortInput(input.sort)
  return {
    first: Math.min((input.first ?? 20), maxLimit),
    after: input.after,
    sort
  }
}

export const getSortDirectionChar = (direction: SortDirection): string => {
  return direction === SortDirection.Asc ? '>' : '<'
}

export const getSortPart = (direction: SortDirection, column: string, valuesLen: number, preColumn: string = '', where: boolean = false): string => {
  preColumn = preColumn.length > 0 ? `${preColumn}.` : preColumn
  const char = getSortDirectionChar(direction)
  const sortPart = /* sql */`
    ${where ? 'WHERE' : 'AND'} (
      ${preColumn}"${column}" ${char} $${valuesLen + 1}
      OR (
        ${preColumn}"${column}" = $${valuesLen + 1}
          AND ${preColumn}id ${char} $${valuesLen + 2}
      )
    )
  `
  return sortPart
}

export const getPagePart = (direction: SortDirection, column: string, valuesLen: number, preColumn: string = ''): string => {
  preColumn = preColumn.length > 0 ? `${preColumn}.` : preColumn

  return /* sql */`
    ORDER BY
      ${preColumn}"${column}" ${direction}, ${preColumn}id ${direction}
    LIMIT $${valuesLen + 1}
  `
}

export interface Page<T> { edges: T[], pageInfo: PageInfo }

export const getPage = <T extends { cursor: string }>(edges: T[], first: number, after: InputMaybe<string> | undefined): Page<T> => {
  const hasExtraRow = edges.length > first
  const trimmed = hasExtraRow ? edges.slice(0, first) : edges

  const startCursor = trimmed.at(0)?.cursor ?? null
  const endCursor = trimmed.at(-1)?.cursor ?? null

  const pageInfo: PageInfo = {
    hasNextPage: edges.length > first,
    hasPreviousPage: Boolean(after),
    startCursor,
    endCursor
  }

  return { edges: trimmed, pageInfo }
}
