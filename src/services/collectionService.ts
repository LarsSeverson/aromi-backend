import { type PaginationParams } from '@src/common/pagination'
import { type DB, type UserCollection } from '@src/db/schema'
import { type SelectQueryBuilder, type Selectable } from 'kysely'
import { ApiService, type ServiceFindCriteria } from './apiService'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'

export type UserCollectionRow = Selectable<UserCollection>

export interface FindAllPaginatedCollectionsParams {
  criteria: ServiceFindCriteria<'userCollections'>
  paginationParams: PaginationParams
}

export class CollectionService extends ApiService<'userCollections'> {
  find (criteria: ServiceFindCriteria<'userCollections'>): ResultAsync<UserCollectionRow, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAll (criteria: ServiceFindCriteria<'userCollections'>): ResultAsync<UserCollectionRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllPaginated (params: FindAllPaginatedCollectionsParams): ResultAsync<UserCollectionRow[], ApiError> {
    const { paginationParams, criteria } = params

    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(paginationParams, criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  list (params: PaginationParams): ResultAsync<UserCollectionRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(params)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  private baseQuery (criteria?: ServiceFindCriteria<'userCollections'>): SelectQueryBuilder<DB, 'userCollections', UserCollectionRow> {
    const { db } = this

    const base = db
      .selectFrom('userCollections')
      .selectAll()

    if (criteria == null) return base

    return this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => {
          const op = this.operand(value)
          return qb.where(column, op, value)
        },
        base
      )
  }

  private paginatedQuery (
    paginationParams: PaginationParams,
    criteria?: ServiceFindCriteria<'userCollections'>
  ): SelectQueryBuilder<DB, 'userCollections', UserCollectionRow> {
    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return this
      .baseQuery(criteria)
      .$if(cursor.isValid, qb =>
        qb
          .where(({ eb, or, and }) =>
            or([
              eb(column, operator, cursor.value),
              and([
                eb(column, '=', cursor.value),
                eb('id', operator, cursor.lastId)
              ])
            ])
          )
      )
      .orderBy(column, direction)
      .orderBy('id', direction)
      .limit(first + 1)
  }
}
