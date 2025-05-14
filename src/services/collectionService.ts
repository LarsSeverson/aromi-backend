import { type PaginationParams } from '@src/common/pagination'
import { type CollectionItem, type DB, type UserCollection } from '@src/db/schema'
import { type SelectQueryBuilder, type Selectable } from 'kysely'
import { ApiService, type FindAllPaginatedParams, type ServiceFindCriteria } from './apiService'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type FragranceRow } from './fragranceService'

export type UserCollectionRow = Selectable<UserCollection>
export interface CollectionItemRow extends Selectable<CollectionItem>, Omit<FragranceRow, 'createdAt' | 'updatedAt' | 'deletedAt'> {
  fCreatedAt: Date
  fUpdatedAt: Date
  fDeletedAt: Date | null
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

  findAllPaginated (params: FindAllPaginatedParams<'userCollections'>): ResultAsync<UserCollectionRow[], ApiError> {
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

  findAllItems (criteria: ServiceFindCriteria<'collectionItems'>): ResultAsync<CollectionItemRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQueryItems(criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllItemsPaginated (params: FindAllPaginatedParams<'collectionItems'>): ResultAsync<CollectionItemRow[], ApiError> {
    const { paginationParams, criteria } = params

    return ResultAsync
      .fromPromise(
        this
          .paginatedItemsQuery(paginationParams, criteria)
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
        (qb, [column, value]) => qb.where(column, this.operand(value), value),
        base
      )
  }

  private baseQueryItems (critera?: ServiceFindCriteria<'collectionItems'>): SelectQueryBuilder<DB, 'collectionItems', CollectionItemRow> {
    const { db, context } = this
    const userId = context.me?.id ?? null

    const base = db
      .selectFrom('collectionItems')
      .innerJoin('fragrances as f', 'f.id', 'fragranceId')
      .leftJoin('fragranceVotes as fv', join =>
        join
          .onRef('fv.fragranceId', '=', 'f.id')
          .on('fv.userId', '=', userId)
          .on('fv.deletedAt', 'is', null)
      )
      .select([
        'collectionItems.collectionId',
        'collectionItems.createdAt',
        'collectionItems.deletedAt',
        'collectionItems.fragranceId',
        'collectionItems.id',
        'collectionItems.updatedAt',
        'f.brand',
        'f.dislikesCount',
        'f.id as fragranceId',
        'f.likesCount',
        'f.name',
        'f.rating',
        'f.reviewsCount',
        'f.voteScore',
        'f.createdAt as fCreatedAt',
        'f.updatedAt as fUpdatedAt',
        'f.deletedAt as fDeletedAt',
        'fv.vote as myVote'
      ])

    if (critera == null) return base

    return this
      .entries(critera)
      .reduce(
        (qb, [column, value]) => qb
          .where(`collectionItems.${column}`, this.operand(value), value),
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

  private paginatedItemsQuery (
    paginationParams: PaginationParams,
    critera?: ServiceFindCriteria<'collectionItems'>
  ): SelectQueryBuilder<DB, 'collectionItems', CollectionItemRow> {
    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return this
      .baseQueryItems(critera)
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
      .orderBy(`collectionItems.${column}`, direction)
      .orderBy('collectionItems.id', direction)
      .limit(first + 1)
  }
}
