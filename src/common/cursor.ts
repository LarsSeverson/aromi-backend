import { SortBy } from '@src/generated/gql-types'

export const encodeCursor = <T>(sortValue: T, id: number): string => {
  const value = sortValue instanceof Date ? sortValue.toISOString() : String(sortValue)
  return Buffer.from(`${value}|${id}`).toString('base64')
}

export const decodeCursor = (cursor: string): { rawValue: string, lastId: number } => {
  const decoded = Buffer.from(cursor, 'base64').toString('ascii')
  const [rawValue, id] = decoded.split('|')
  return { rawValue, lastId: Number(id) }
}

export const parseRawCursorValue = (rawValue: string, sortBy: SortBy): number | Date => {
  return sortBy === SortBy.Id
    ? Number(rawValue)
    : new Date(rawValue)
}
