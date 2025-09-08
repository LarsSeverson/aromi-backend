import { type DataSources } from '@src/datasources/index.js'
import { type Index } from 'meilisearch'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/utils/error.js'
import { type SearchParams, type SearchResult, type BaseSearchIndex, type IndexName } from '../types.js'

export abstract class SearchService<T extends BaseSearchIndex> {
  meili: DataSources['meili']

  private readonly indexName: IndexName

  constructor (
    sources: DataSources,
    indexName: IndexName
  ) {
    this.meili = sources.meili
    this.indexName = indexName
  }

  get index (): Index<T> {
    return this.meili.client.index<T>(this.indexName)
  }

  search (params: SearchParams): ResultAsync<SearchResult<T>, ApiError> {
    const { term, pagination } = params
    const { offset, first } = pagination

    return ResultAsync
      .fromPromise(
        this
          .index
          .search(
            term,
            {
              limit: first,
              offset
            }
          ),
        error => ApiError.fromMeili(error)
      )
      .map(result =>
        ({
          total: result.estimatedTotalHits ?? 0,
          hits: result.hits,
          offset,
          first
        })
      )
  }

  addDocuments (documents: T[]): ResultAsync<this, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .addDocuments(documents),
        error => ApiError.fromMeili(error)
      )
      .map(() => this)
  }

  updateDocuments (documents: T[]): ResultAsync<this, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .updateDocuments(documents),
        error => ApiError.fromMeili(error)
      )
      .map(() => this)
  }

  deleteDocuments (ids: string[]): ResultAsync<this, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .deleteDocuments(ids),
        error => ApiError.fromMeili(error)
      )
      .map(() => this)
  }

  getDocument (id: string): ResultAsync<T, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .getDocument(id),
        error => ApiError.fromMeili(error)
      )
  }

  clearIndex (): ResultAsync<this, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .deleteAllDocuments(),
        error => ApiError.fromMeili(error)
      )
      .map(() => this)
  }

  configure (
    settings: Parameters<typeof this.index.updateSettings>[0]
  ): ResultAsync<this, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .updateSettings(settings),
        error => ApiError.fromMeili(error)
      )
      .map(() => this)
  }
}
