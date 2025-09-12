import type { DataSources } from '@src/datasources/index.js'
import type { Index } from 'meilisearch'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import type { SearchParams, SearchResult, BaseSearchIndex, IndexName } from '../types.js'

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

  search (params: SearchParams): ResultAsync<SearchResult<T>, BackendError> {
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
        error => BackendError.fromMeili(error)
      )
      .map(result =>
        ({
          total: result.estimatedTotalHits ?? 0,
          hits: result.hits,
          offset,
          first
        }))
  }

  addDocument (document: T): ResultAsync<this, BackendError> {
    return this.addDocuments([document])
  }

  addDocuments (documents: T[]): ResultAsync<this, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .addDocuments(documents),
        error => BackendError.fromMeili(error)
      )
      .map(() => this)
  }

  updateDocuments (documents: T[]): ResultAsync<this, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .updateDocuments(documents),
        error => BackendError.fromMeili(error)
      )
      .map(() => this)
  }

  deleteDocuments (ids: string[]): ResultAsync<this, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .deleteDocuments(ids),
        error => BackendError.fromMeili(error)
      )
      .map(() => this)
  }

  getDocument (id: string): ResultAsync<T, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .getDocument(id),
        error => BackendError.fromMeili(error)
      )
  }

  clearIndex (): ResultAsync<this, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .deleteAllDocuments(),
        error => BackendError.fromMeili(error)
      )
      .map(() => this)
  }

  configure (
    settings: Parameters<typeof this.index.updateSettings>[0]
  ): ResultAsync<this, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .index
          .updateSettings(settings),
        error => BackendError.fromMeili(error)
      )
      .map(() => this)
  }
}
