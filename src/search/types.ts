export interface BaseSearchIndex {
  id: string
}

export interface SearchPagination {
  offset: number
  first: number
}

export interface SearchParams {
  term?: string | null
  pagination: SearchPagination
}

export interface SearchResult<T> {
  total: number
  hits: T[]

  offset: number
  first: number
}

export const INDEX_NAMES = {
  BRANDS: 'brands',
  ACCORDS: 'accords',
  NOTES: 'notes'
} as const

export type IndexName = (typeof INDEX_NAMES)[keyof typeof INDEX_NAMES]
