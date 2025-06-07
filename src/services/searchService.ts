import { type ApiDataSources } from '@src/datasources/datasources'
import { ApiService } from './apiService'
import { ResultAsync } from 'neverthrow'
import { type SearchResponse } from 'meilisearch'
import { ApiError } from '@src/common/error'

const DEFAULT_SEARCH_LIMIT = 20

export interface BaseIndex {
  id: number
}

export interface SearchParams {
  query?: string
  limit?: number
  offset?: number
}

export class SearchService<T extends BaseIndex> extends ApiService {
  private readonly searchDs: ApiDataSources['search']
  private readonly index: string

  constructor (
    sources: ApiDataSources,
    index: string
  ) {
    super(sources)
    this.searchDs = sources.search
    this.index = index
  }

  search (params: SearchParams): ResultAsync<SearchResponse<T>, ApiError> {
    const { query, limit = DEFAULT_SEARCH_LIMIT, offset = 0 } = params

    return ResultAsync
      .fromPromise(
        this
          .searchDs
          .client
          .index(this.index)
          .search<T>(query, { limit: limit + 1, offset }),
        error => ApiError.fromMeili(error)
      )
  }
}
