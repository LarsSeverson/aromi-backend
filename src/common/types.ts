import { type SortBy, type VoteSortBy } from '@src/generated/gql-types'

export const INVALID_ID = -1

export type NonNullableType<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type Override<T, U> = Omit<T, keyof U> & U

export type ValueOf<T> = T[keyof T]

export type SortColumn = SortBy | VoteSortBy
