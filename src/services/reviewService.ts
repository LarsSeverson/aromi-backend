import { ApiError } from '@src/common/error'
import { type DB, type FragranceReview } from '@src/db/schema'
import { sql, type SelectQueryBuilder, type Selectable } from 'kysely'
import { errAsync, ResultAsync } from 'neverthrow'
import { ApiService, type MyVote, type ServiceFindCriteria } from './apiService'
import { type PaginationParams } from '@src/common/pagination'
import { type VoteSortBy } from '@src/generated/gql-types'

export type FragranceReviewRow = Selectable<FragranceReview> & MyVote

export interface VoteOnReviewParams {
  reviewId: number
  vote: boolean | null
}

export class ReviewService extends ApiService<'fragranceReviews'> {
  find (
    criteria: ServiceFindCriteria<'fragranceReviews'>
  ): ResultAsync<FragranceReviewRow, ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAll (
    criteria: ServiceFindCriteria<'fragranceReviews'>
  ): ResultAsync<FragranceReviewRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .baseQuery(criteria)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAllPaginated (
    criteria: ServiceFindCriteria<'fragranceReviews'>,
    paginationParams: PaginationParams<VoteSortBy>
  ): ResultAsync<FragranceReviewRow[], ApiError> {
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
  ): ResultAsync<FragranceReviewRow[], ApiError> {
    return ResultAsync
      .fromPromise(
        this
          .paginatedQuery(params)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  create (
    data: Pick<FragranceReviewRow, 'fragranceId' | 'rating' | 'reviewText'>
  ): ResultAsync<FragranceReviewRow, ApiError> {
    const { db, context } = this
    const { fragranceId, rating, reviewText } = data
    const userId = context.me?.id ?? null

    if (userId == null) {
      return errAsync(
        new ApiError(
          'NOT_AUTHORIZED',
          'You are not authorized to perform this action',
          403,
          'create() review called without valid user context'
        )
      )
    }

    return ResultAsync
      .fromPromise(
        db
          .insertInto('fragranceReviews')
          .values({ fragranceId, userId, rating, reviewText })
          .onConflict(c =>
            c
              .columns(['fragranceId', 'userId'])
              .doUpdateSet({
                rating,
                reviewText,
                updatedAt: new Date()
              })
          )
          .returningAll()
          .returning([
            sql<number>`0`.as('myVote')
          ])
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  vote (
    params: VoteOnReviewParams
  ): ResultAsync<FragranceReviewRow, ApiError> {
    const { db, context } = this
    const { reviewId, vote } = params
    const userId = context.me?.id ?? null

    if (userId == null) {
      return errAsync(
        new ApiError(
          'NOT_AUTHORIZED',
          'You are not authorized to perform this action',
          403,
          'Vote on review called without valid user context'
        )
      )
    }

    const voteValue = vote == null ? 0 : vote ? 1 : -1
    const deletedAt = vote == null ? new Date() : null

    return ResultAsync
      .fromPromise(
        db
          .insertInto('fragranceReviewVotes')
          .values({ fragranceReviewId: reviewId, userId, vote: voteValue, deletedAt })
          .onConflict(c =>
            c
              .columns(['fragranceReviewId', 'userId'])
              .doUpdateSet({ vote: voteValue, deletedAt })
          )
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
      .andThen(() => this.find({ id: reviewId }))
  }

  private baseQuery (
    criteria?: ServiceFindCriteria<'fragranceReviews'>
  ): SelectQueryBuilder<DB, 'fragranceReviews', FragranceReviewRow> {
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
        (qb, [column, value]) => qb
          .where(`fragranceReviews.${column}`, this.operand(value), value),
        base
      )
  }

  private paginatedQuery (
    paginationParams: PaginationParams<VoteSortBy>,
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
      .orderBy(`fragranceReviews.${column}`, direction)
      .orderBy('fragranceReviews.id', direction)
      .limit(first + 1)
  }
}
