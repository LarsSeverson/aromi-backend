import { type SortColumn } from './types'

export interface CursorTypes {
  createdAt: string
  updatedAt: string
  id: number
  voteScore: number
}

export interface ApiCursor<T = unknown> {
  value: T | null
  lastId: number | null
  isValid: boolean
}

export interface ApiRawCursor {
  value: unknown
  lastId: number
}

export const encodeCursor = (sortValue: unknown, id: string): string => {
  const value = typeof sortValue === 'string'
    ? sortValue
    : String(sortValue)

  return Buffer
    .from(`${value}|${id}`)
    .toString('base64')
}

export const decodeCursor = (cursor: string): ApiRawCursor => {
  const decoded = Buffer
    .from(cursor, 'base64')
    .toString('ascii')
  const [value, id] = decoded.split('|')

  return { value, lastId: Number(id) }
}

export interface ParseRawCursorParams {
  raw: ApiRawCursor
  sortBy: string
  numericFields: Set<string>
}

export interface ParseCursorParams<S extends string> {
  cursor: string
  sortBy: S
  numericFields: Set<S>
}

export const parseCursor = <C extends SortColumn>(
  cursor: string,
  column: C
): ApiCursor<CursorTypes[C]> => {
  const { value: rawValue, lastId } = decodeCursor(cursor)
  const parser = TypeParsers[column]
  const value = (rawValue != null && parser != null)
    ? parser(rawValue) as CursorTypes[C]
    : null

  return { value, lastId, isValid: !isNaN(lastId) }
}

const TypeParsers: Record<SortColumn, (value: unknown) => unknown> = {
  id: v => Number(v),
  voteScore: v => Number(v),
  createdAt: v => v as string,
  updatedAt: v => v as string
}
