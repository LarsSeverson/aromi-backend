import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type FragranceImage, type Fragrance, type FragranceReview } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'

export type FragranceRow = Selectable<Fragrance> & { myVote: number | null }
export type FragranceImageRow = Selectable<FragranceImage>
export type FragranceReviewRow = Selectable<FragranceReview> & { myVote: number | null }
export type FragranceReviewDistRow = Pick<FragranceReviewRow, 'rating' | 'fragranceId'> & { count: number }

export interface GetFragranceImagesParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
}

export interface GetReviewDistributionsParams {
  fragranceIds: number[]
}

export interface GetFragranceReviewsParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
}

export class FragranceService {
  me?: ApiContext['me']

  constructor (private readonly sources: ApiDataSources) {}

  // TODO: Explore builder pattern maybe
  withMe (me: ApiContext['me']): this {
    this.me = me
    return this
  }

  getById (id: number): ResultAsync<FragranceRow, ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .leftJoin('fragranceVotes as fv', (join) =>
            join
              .onRef('fv.fragranceId', '=', 'f.id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('f')
          .select('fv.vote as myVote')
          .where('f.id', '=', id)
          .executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getByIds (ids: number[]): ResultAsync<FragranceRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .leftJoin('fragranceVotes as fv', (join) =>
            join
              .onRef('fv.fragranceId', '=', 'f.id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('f')
          .select('fv.vote as myVote')
          .where('f.id', 'in', ids)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  list (params: PaginationParams): ResultAsync<FragranceRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null

    const { first, cursor, sortParams } = params
    const { column, operators, direction } = sortParams
    const { valueOp, idOp } = operators

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .leftJoin('fragranceVotes as fv', (join) =>
            join
              .onRef('fv.fragranceId', '=', 'f.id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('f')
          .select('fv.vote as myVote')
          .$if(cursor.isValid, qb =>
            qb
              .where(`f.${column}`, valueOp, cursor.value)
              .where('f.id', idOp, cursor.lastId)
          )
          .orderBy(`f.${column}`, direction)
          .orderBy('f.id', direction)
          .limit(first + 1)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getImages (params: GetFragranceImagesParams): ResultAsync<FragranceImageRow[], ApiError> {
    const { db } = this.sources
    const { fragranceIds, paginationParams } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operators, direction } = sortParams
    const { valueOp, idOp } = operators

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragranceImages')
          .selectAll()
          .where('fragranceId', 'in', fragranceIds)
          .$if(cursor.isValid, qb =>
            qb
              .where(column, valueOp, cursor.value)
              .where('id', idOp, cursor.lastId)
          )
          .orderBy(column, direction)
          .orderBy('id', direction)
          .limit(first + 1)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getReviews (params: GetFragranceReviewsParams): ResultAsync<FragranceReviewRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null
    const { fragranceIds, paginationParams } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operators, direction } = sortParams
    const { valueOp, idOp } = operators

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragranceReviews as fr')
          .leftJoin('fragranceReviewVotes as rv', (join) =>
            join
              .onRef('rv.fragranceReviewId', '=', 'fr.id')
              .on('rv.userId', '=', userId)
              .on('rv.deletedAt', 'is', null)
          )
          .selectAll('fr')
          .select('rv.vote as myVote')
          .where('fr.fragranceId', 'in', fragranceIds)
          .$if(cursor.isValid, qb =>
            qb
              .where(`fr.${column}`, valueOp, cursor.value)
              .where('fr.id', idOp, cursor.lastId)
          )
          .orderBy(`fr.${column}`, direction)
          .orderBy('fr.id', direction)
          .limit(first + 1)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getReviewDistributions (params: GetReviewDistributionsParams): ResultAsync<FragranceReviewDistRow[], ApiError> {
    const { db } = this.sources
    const { fragranceIds } = params

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragranceReviews')
          .select([
            'rating',
            'fragranceId',
            db
              .fn
              .count<number>('rating')
              .as('count')
          ])
          .where('fragranceId', 'in', fragranceIds)
          .groupBy(['fragranceId', 'rating'])
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
