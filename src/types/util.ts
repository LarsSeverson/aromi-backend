import { ASCENDING_ORDER, DESCENDING_ORDER } from '@src/common/constants'
import { SortDirection } from '@src/generated/gql-types'

export type NonNullableType<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type DeepNonNullable<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends (...args: unknown[]) => unknown
      ? T[K]
      : DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>
}

export type Override<T, U> = Omit<T, keyof U> & U

export type ValueOf<T> = T[keyof T]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DBAny = any

export const PAGINATION_OPERATORS = {
  [SortDirection.Ascending]: '>',
  [SortDirection.Descending]: '<'
} as const

export const PAGINATION_DIRECTIONS = {
  [SortDirection.Ascending]: ASCENDING_ORDER,
  [SortDirection.Descending]: DESCENDING_ORDER
} as const

export type PaginationOperator = typeof PAGINATION_OPERATORS[keyof typeof PAGINATION_OPERATORS]

export type PaginationDirection = typeof PAGINATION_DIRECTIONS[keyof typeof PAGINATION_DIRECTIONS]
