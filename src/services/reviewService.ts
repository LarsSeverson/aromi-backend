import { ApiError } from '@src/common/error'
import { type DB, type FragranceReview } from '@src/db/schema'
import { type SelectQueryBuilder, type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { ApiService, type MyVote, type FindAllPaginatedParams, type ServiceFindCriteria } from './apiService'
import { type PaginationParams } from '@src/common/pagination'

export type FragranceReviewRow = Selectable<FragranceReview> & MyVote

export class ReviewService extends ApiService<'fragranceReviews'> {
  find (criteria: ServiceFindCriteria<'fragranceReviews'>): ResultAsync<FragranceReviewRow, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAll (criteria: ServiceFindCriteria<'fragranceReviews'>): ResultAsync<FragranceReviewRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllPaginated (params: FindAllPaginatedParams<'fragranceReviews'>): ResultAsync<FragranceReviewRow[], ApiError> {
    const { paginationParams, criteria } = params

    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(paginationParams, criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  list (params: PaginationParams): ResultAsync<FragranceReviewRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(params)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  private baseQuery (criteria?: ServiceFindCriteria<'fragranceReviews'>): SelectQueryBuilder<DB, 'fragranceReviews', FragranceReviewRow> {
    const { db, context } = this
    const userId = context.me?.id ?? null

    const base = db
      .selectFrom('fragranceReviews')
      .leftJoin('fragranceReviewVotes as rv', join =>
        join
          .onRef('rv.fragranceReviewId', '=', 'fragranceReviews.id')
          .on('rv.userId', '=', userId)
          .on('rv.deletedAt', 'is', null)
      )
      .selectAll('fragranceReviews')
      .select('rv.vote as myVote')

    if (criteria == null) return base

    return this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => qb.where(column, this.operand(value), value),
        base
      )
  }

  private paginatedQuery (
    paginationParams: PaginationParams,
    criteria?: ServiceFindCriteria<'fragranceReviews'>
  ): SelectQueryBuilder<DB, 'fragranceReviews', FragranceReviewRow> {
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
