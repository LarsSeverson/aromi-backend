import type { DataSources } from '@src/datasources/index.js'
import type { Index, IndexOptions, Settings } from 'meilisearch'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
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
    const { term, pagination, filter } = params
    const { offset, first } = pagination

    return ResultAsync
      .fromPromise(
        this
          .index
          .search(
            term,
            {
              limit: first + 1,
              offset,
              filter
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

  updateDocument (document: Partial<T>): ResultAsync<this, BackendError> {
    return this.updateDocuments([document])
  }

  updateDocuments (documents: Array<Partial<T>>): ResultAsync<this, BackendError> {
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

  upsertDocument (document: T): ResultAsync<this, BackendError> {
    return this
      .getDocument(document.id)
      .andThen(() => this.updateDocument(document))
      .orElse(() => this.addDocument(document))
  }

  getIndex (): ResultAsync<Index<T>, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .meili
          .client
          .getIndex<T>(this.indexName),
        error => BackendError.fromMeili(error)
      )
  }

  createIndex (
    config?: IndexOptions
  ): ResultAsync<this, BackendError> {
    return ResultAsync
      .fromPromise(
        this
          .meili
          .client
          .createIndex(this.indexName, config),
        error => BackendError.fromMeili(error)
      )
      .map(() => this)
  }

  configureIndex (
    settings: Settings
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

  ensureIndex (
    config?: IndexOptions,
    settings?: Settings
  ): ResultAsync<this, BackendError> {
    return this
      .createIndex(config)
      .orElse(error => {
        if (error.code === 'index_already_exists') return okAsync(this)
        return errAsync(error)
      })
      .andThen(() => {
        return this.configureIndex(settings ?? {})
      })
  }
}
