import { type PaginationParams } from '@src/common/pagination'
import { type SelectQueryBuilder, type Selectable } from 'kysely'
import { DBService, type ServiceFindCriteria } from './DBService'
import { errAsync, ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'
import { type FragranceRow } from './fragranceService'
import { type FragranceCollectionItem, type FragranceCollection, type DB } from '@src/db/schema'

export type FragranceCollectionRow = Selectable<FragranceCollection>
export interface FragranceCollectionItemRow extends Selectable<FragranceCollectionItem>,
  Omit<FragranceRow, 'createdAt' | 'updatedAt' | 'deletedAt'> {
  fCreatedAt: Date
  fUpdatedAt: Date
  fDeletedAt: Date | null
}

export class CollectionService extends DBService<'fragranceCollections'> {
  find (
    criteria: ServiceFindCriteria<'fragranceCollections'>
  ): ResultAsync<FragranceCollectionRow, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAll (
    criteria: ServiceFindCriteria<'fragranceCollections'>
  ): ResultAsync<FragranceCollectionRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllPaginated (
    criteria: ServiceFindCriteria<'fragranceCollections'>,
    paginationParams: PaginationParams
  ): ResultAsync<FragranceCollectionRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(paginationParams, criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  list (
    params: PaginationParams
  ): ResultAsync<FragranceCollectionRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(params)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findItem (
    criteria: ServiceFindCriteria<'fragranceCollectionItems'>
  ): ResultAsync<FragranceCollectionItemRow, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQueryItems(criteria)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllItems (
    criteria: ServiceFindCriteria<'fragranceCollectionItems'>
  ): ResultAsync<FragranceCollectionItemRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQueryItems(criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllItemsPaginated (
    criteria: ServiceFindCriteria<'fragranceCollectionItems'>,
    paginationParams: PaginationParams
  ): ResultAsync<FragranceCollectionItemRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .paginatedItemsQuery(paginationParams, criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  create (
    data: Pick<FragranceCollectionRow, 'name'>
  ): ResultAsync<FragranceCollectionRow, ApiError> {
    const { db, context } = this
    const { name } = data
    const userId = context.me?.id ?? null

    if (userId == null) {
      return errAsync(
        new ApiError(
          'NOT_AUTHORIZED',
          'You are not authorized to perform this action',
          403,
          'create() collection called without valid user context'
        )
      )
    }

    return ResultAsync
      .fromPromise(
        db
          .insertInto('fragranceCollections')
          .values({ userId, name })
          .returningAll()
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  createItem (
    data: Pick<FragranceCollectionItemRow, 'collectionId' | 'fragranceId'>
  ): ResultAsync<FragranceCollectionItemRow, ApiError> {
    const { db, context } = this
    const { fragranceId, collectionId } = data
    const userId = context.me?.id ?? null

    if (userId == null) {
      return errAsync(
        new ApiError(
          'NOT_AUTHORIZED',
          'You are not authorized to perform this action',
          403,
          'createItem() collection item called without valid user context'
        )
      )
    }

    return ResultAsync
      .fromPromise(
        db
          .insertInto('fragranceCollectionItems')
          .values({ fragranceId, collectionId, rank: 10 })
          .returning('id')
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
      .andThen(({ id }) => this.findItem({ id }))
  }

  private baseQuery (
    criteria?: ServiceFindCriteria<'fragranceCollections'>
  ): SelectQueryBuilder<DB, 'fragranceCollections', FragranceCollectionRow> {
    const { db } = this

    const base = db
      .selectFrom('fragranceCollections')
      .selectAll()

    if (criteria == null) return base

    return this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => qb.where(column, this.operand(value), value),
        base
      )
  }

  private baseQueryItems (
    critera?: ServiceFindCriteria<'fragranceCollectionItems'>
  ): SelectQueryBuilder<DB, 'fragranceCollectionItems', FragranceCollectionItemRow> {
    const { db, context } = this
    const userId = context.me?.id ?? null

    const base = db
      .selectFrom('fragranceCollectionItems')
      .innerJoin('fragrances as f', 'f.id', 'fragranceId')
      .leftJoin('fragranceVotes as fv', join =>
        join
          .onRef('fv.fragranceId', '=', 'f.id')
          .on('fv.userId', '=', userId)
          .on('fv.deletedAt', 'is', null)
      )
      .select([
        'fragranceCollectionItems.collectionId',
        'fragranceCollectionItems.createdAt',
        'fragranceCollectionItems.deletedAt',
        'fragranceCollectionItems.fragranceId',
        'fragranceCollectionItems.id',
        'fragranceCollectionItems.updatedAt',
        'fragranceCollectionItems.rank',
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
          .where(`fragranceCollectionItems.${column}`, this.operand(value), value),
        base
      )
  }

  private paginatedQuery (
    paginationParams: PaginationParams,
    criteria?: ServiceFindCriteria<'fragranceCollections'>
  ): SelectQueryBuilder<DB, 'fragranceCollections', FragranceCollectionRow> {
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
    critera?: ServiceFindCriteria<'fragranceCollectionItems'>
  ): SelectQueryBuilder<DB, 'fragranceCollectionItems', FragranceCollectionItemRow> {
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
      .orderBy(`fragranceCollectionItems.${column}`, direction)
      .orderBy('fragranceCollectionItems.id', direction)
      .limit(first + 1)
  }
}
