import { SortBy } from '@src/generated/gql-types'

export interface ApiCursor {
  value: number | Date | null
  lastId: number | null
  isValid: boolean
}

export interface ApiRawCursor {
  rawValue: string
  lastId: number
}

export const encodeCursor = (sortValue: number | Date, id: number): string => {
  const value = sortValue instanceof Date ? sortValue.toISOString() : String(sortValue)
  return Buffer.from(`${value}|${id}`).toString('base64')
}

export const decodeCursor = (cursor: string): ApiRawCursor => {
  const decoded = Buffer
    .from(cursor, 'base64')
    .toString('ascii')
  const [rawValue, id] = decoded.split('|')

  return { rawValue, lastId: Number(id) }
}

const parseRawCursor = (rawCursor: ApiRawCursor, sortBy: SortBy): Omit<ApiCursor, 'isValid'> => {
  const { rawValue, lastId } = rawCursor
  const parsedLastId = isNaN(lastId) ? null : lastId

  if (sortBy === SortBy.Id) {
    const parsedNumber = Number(rawValue)
    const parsedValue = isNaN(parsedNumber) ? null : parsedNumber

    return { value: parsedValue, lastId: parsedLastId }
  }

  const parsedDate = new Date(rawValue)
  const parsedValue = isNaN(parsedDate.getTime()) ? null : parsedDate

  return { value: parsedValue, lastId: parsedLastId }
}

export const parseCursor = (opaqueCursor: string, sortBy: SortBy): ApiCursor => {
  const decoded = decodeCursor(opaqueCursor)
  const { value, lastId } = parseRawCursor(decoded, sortBy)

  return { value, lastId, isValid: value != null }
}
