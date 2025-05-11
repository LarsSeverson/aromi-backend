import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type FragranceImage, type Fragrance, type FragranceReview, type FragranceTrait, type FragranceAccord } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'

export type FragranceRow = Selectable<Fragrance> & { myVote: number | null }
export type FragranceImageRow = Selectable<FragranceImage>
export type FragranceReviewRow = Selectable<FragranceReview> & { myVote: number | null }
export type FragranceReviewDistRow = Pick<FragranceReviewRow, 'rating' | 'fragranceId'> & { count: number }
export type FragranceTraitRow = Selectable<FragranceTrait> & { myVote: number | null }

export interface FragranceAccordRow extends Selectable<FragranceAccord> {
  accordId: number
  myVote: number | null
  name: string
  color: string
  isFill?: boolean | null
}

export interface GetFragranceImagesMultipleParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
}

export interface GetFragranceAccordsParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
  fill?: boolean
}

export interface GetReviewDistributionsMultipleParams {
  fragranceIds: number[]
}

export interface GetFragranceReviewsMultipleParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
}

export interface GetFragranceTraitsMultipleParams {
  fragranceIds: number[]
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
    const { column, operator, direction } = sortParams

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
              .where(({ eb, or, and }) =>
                or([
                  eb(`f.${column}`, operator, cursor.value),
                  and([
                    eb(`f.${column}`, '=', cursor.value),
                    eb('f.id', operator, cursor.lastId)
                  ])
                ])
              )
          )
          .orderBy(`f.${column}`, direction)
          .orderBy('f.id', direction)
          .limit(first + 1)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getAccords (params: GetFragranceAccordsParams): ResultAsync<FragranceAccordRow[], ApiError> {
    const isSingle = params.fragranceIds.length === 1

    if (isSingle) {
      return this.getAccordsOnSingle(params)
    }

    return this.getAccordsOnMultiple(params)
  }

  getAccordsOnSingle (params: GetFragranceAccordsParams): ResultAsync<FragranceAccordRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null
    const { fragranceIds, paginationParams, fill = false } = params
    const fragranceId = fragranceIds[0]

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    const query = db
      .selectFrom('fragranceAccords as fa')
      .where('fa.fragranceId', '=', fragranceId)
      .leftJoin('fragranceAccordVotes as av', (join) =>
        join
          .onRef('av.fragranceAccordId', '=', 'fa.id')
          .on('av.userId', '=', userId)
      )
      .innerJoin('accords as a', (join) =>
        join
          .onRef('a.id', '=', 'fa.accordId')
      )
      .selectAll('fa')
      .select([
        'av.id as myVote',
        'a.name',
        'a.color',
        sql<boolean>`FALSE`.as('isFill')
      ])
      .$if(fill, qb =>
        qb
          .unionAll(
            db
              .selectFrom('accords as a2')
              .leftJoin('fragranceAccords as fa2', join =>
                join
                  .onRef('fa2.fragranceId', '=', sql<number>`${fragranceId}`)
                  .onRef('fa2.accordId', '=', 'a2.id')
              )
              .where('fa2.id', 'is', null)
              .select([
                sql<number>`${fragranceId}`.as('fragranceId'),
                'a2.id as accordId',
                sql<number>`0`.as('votes'),
                'a2.id as id',
                'a2.createdAt',
                'a2.updatedAt',
                'a2.deletedAt',
                sql<number | null>`null`.as('myVote'),
                'a2.name as name',
                'a2.color as color',
                sql<boolean>`TRUE`.as('isFill')
              ])
          )
      )
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
      .orderBy('isFill')
      .orderBy(column, direction)
      .orderBy('id', direction)
      .limit(first + 1)

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getImagesOnMultiple (params: GetFragranceImagesMultipleParams): ResultAsync<FragranceImageRow[], ApiError> {
    const { db } = this.sources
    const { fragranceIds, paginationParams } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .crossJoinLateral(
            (eb) => eb
              .selectFrom('fragranceImages as fi')
              .whereRef('fi.fragranceId', '=', 'f.id')
              .selectAll()
              .where('fragranceId', 'in', fragranceIds)
              .$if(cursor.isValid, qb =>
                qb
                  .where(({ eb, or, and }) =>
                    or([
                      eb(`fi.${column}`, operator, cursor.value),
                      and([
                        eb(`fi.${column}`, '=', cursor.value),
                        eb('fi.id', operator, cursor.lastId)
                      ])
                    ])
                  )
              )
              .orderBy(column, direction)
              .orderBy('fi.id', direction)
              .limit(first + 1)
              .as('fiPage')
          )
          .selectAll('fiPage')
          .where('f.id', 'in', fragranceIds)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  /*
    Getting accords on multiple fragrances does not allow fill. Use fill for a specific (a single) fragrance
  */
  getAccordsOnMultiple (params: GetFragranceAccordsParams): ResultAsync<FragranceAccordRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null
    const { fragranceIds, paginationParams } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .crossJoinLateral(
            (eb) => eb
              .selectFrom('fragranceAccords as fa')
              .whereRef('fa.fragranceId', '=', 'f.id')
              .leftJoin('fragranceAccordVotes as av', (join) =>
                join
                  .onRef('av.fragranceAccordId', '=', 'fa.id')
                  .on('av.userId', '=', userId)
              )
              .innerJoin('accords as a', (join) =>
                join
                  .onRef('a.id', '=', 'fa.accordId')
              )
              .selectAll('fa')
              .select('av.id as myVote')
              .select(['a.id as accordId', 'a.name', 'a.color'])
              .$if(cursor.isValid, qb =>
                qb
                  .where(({ eb, or, and }) =>
                    or([
                      eb(`fa.${column}`, operator, cursor.value),
                      and([
                        eb(`fa.${column}`, '=', cursor.value),
                        eb('fa.id', operator, cursor.lastId)
                      ])
                    ])
                  )
              )
              .orderBy(`fa.${column}`, direction)
              .orderBy('fa.id', direction)
              .limit(first + 1)
              .as('faPage')
          )
          .selectAll('faPage')
          .where('f.id', 'in', fragranceIds)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getReviewsOnMultiple (params: GetFragranceReviewsMultipleParams): ResultAsync<FragranceReviewRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null
    const { fragranceIds, paginationParams } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .crossJoinLateral(
            (eb) => eb
              .selectFrom('fragranceReviews as fr')
              .whereRef('fr.fragranceId', '=', 'f.id')
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
                  .where(({ eb, or, and }) =>
                    or([
                      eb(`fr.${column}`, operator, cursor.value),
                      and([
                        eb(`fr.${column}`, '=', cursor.value),
                        eb('fr.id', operator, cursor.lastId)
                      ])
                    ])
                  )
              )
              .orderBy(`fr.${column}`, direction)
              .orderBy('fr.id', direction)
              .limit(first + 1)
              .as('frPage')
          )
          .selectAll('frPage')
          .where('f.id', 'in', fragranceIds)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getReviewDistributionsOnMultiple (params: GetReviewDistributionsMultipleParams): ResultAsync<FragranceReviewDistRow[], ApiError> {
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

  getTraitsOnMultiple (params: GetFragranceTraitsMultipleParams): ResultAsync<FragranceTraitRow[], ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null
    const { fragranceIds } = params

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragranceTraits as ft')
          .leftJoin('fragranceTraitVotes as tv', (join) =>
            join
              .onRef('tv.fragranceTraitId', '=', 'ft.id')
              .on('tv.userId', '=', userId)
              .on('tv.deletedAt', 'is', null)
          )
          .selectAll('ft')
          .select('tv.value as myVote')
          .where('ft.fragranceId', 'in', fragranceIds)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
