import type { Filter } from 'meilisearch'

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
  filter?: Filter
}

export interface SearchResult<T> {
  total: number
  hits: T[]

  offset: number
  first: number
}

export const INDEX_NAMES = {
  FRAGRANCES: 'fragrances',
  BRANDS: 'brands',
  ACCORDS: 'accords',
  NOTES: 'notes',
  REVIEWS: 'reviews',
  USERS: 'users',
  POSTS: 'posts',
  POST_COMMENTS: 'post-comments'
} as const

export type IndexName = (typeof INDEX_NAMES)[keyof typeof INDEX_NAMES]
