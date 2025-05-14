import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type FragranceImage, type Fragrance, type FragranceReview, type FragranceTrait, type FragranceAccord, type FragranceNote, type NoteLayerEnum } from '@src/db/schema'
import { sql, type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { ApiService, type ServiceFindCriteria } from './apiService'

/*
  TODO:
    - This class was made before the abstract ApiService class was made.
    convert this class to a more ApiService style.

    - Split up the services so this class isn't responsible for everything
*/

interface MyVote { myVote: number | null }

export type FragranceRow = Selectable<Fragrance> & MyVote
export type FragranceImageRow = Selectable<FragranceImage>
export type FragranceReviewRow = Selectable<FragranceReview> & MyVote
export type FragranceReviewDistRow = Pick<FragranceReviewRow, 'rating' | 'fragranceId'> & { count: number }
export type FragranceTraitRow = Selectable<FragranceTrait> & MyVote

export interface FragranceAccordRow extends Selectable<FragranceAccord>, MyVote {
  accordId: number
  name: string
  color: string
  isFill?: boolean | null
}

export interface FragranceNoteRow extends Selectable<FragranceNote>, MyVote {
  noteId: number
  name: string
  s3Key: string
  isFill?: boolean | null
}

export interface GetFragranceAccordsParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
  fill?: boolean
}

export interface GetFragranceNotesParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
  layer: NoteLayerEnum
  fill?: boolean
}

export type GetFragranceAccordsOnSingleParams = Omit<GetFragranceAccordsParams, 'fragranceIds'> & { fragranceId: number }
export type GetFragranceNotesOnSingleParams = Omit<GetFragranceNotesParams, 'fragranceIds'> & { fragranceId: number }

export type GetFragragranceAccordsOnMultipleParams = GetFragranceAccordsParams
export type GetFragranceNotesOnMultpleParams = GetFragranceNotesParams

export interface GetFragranceImagesOnMultipleParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
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

export class FragranceService extends ApiService<'fragrances'> {
  find (criteria: ServiceFindCriteria<'fragrances'>): ResultAsync<FragranceRow, ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null

    const query = this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => {
          const op = this.operand(value)
          return qb.where(column, op, value)
        },
        db
          .selectFrom('fragrances')
          .leftJoin('fragranceVotes as fv', (join) =>
            join
              .onRef('fv.fragranceId', '=', 'id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('fragrances')
          .select('fv.vote as myVote')
      )

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAll (criteria: ServiceFindCriteria<'fragrances'>): ResultAsync<FragranceRow[], ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null

    const query = this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => {
          const op = this.operand(value)
          return qb.where(column, op, value)
        },
        db
          .selectFrom('fragrances')
          .leftJoin('fragranceVotes as fv', (join) =>
            join
              .onRef('fv.fragranceId', '=', 'id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('fragrances')
          .select('fv.vote as myVote')
      )

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getById (id: number): ResultAsync<FragranceRow, ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null

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
    const { db } = this
    const userId = this.context.me?.id ?? null

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
    const { db } = this
    const userId = this.context.me?.id ?? null

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
      const fragranceId = params.fragranceIds[0]
      return this.getAccordsOnSingle({ ...params, fragranceId })
    }

    return this.getAccordsOnMultiple(params)
  }

  getNotes (params: GetFragranceNotesParams): ResultAsync<FragranceNoteRow[], ApiError> {
    const { fragranceIds } = params

    const isSingle = fragranceIds.length === 1

    if (isSingle) {
      const fragranceId = params.fragranceIds[0]
      return this.getNotesOnSingle({ ...params, fragranceId })
    }

    return this.getNotesOnMultiple(params)
  }

  getAccordsOnSingle (params: GetFragranceAccordsOnSingleParams): ResultAsync<FragranceAccordRow[], ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null
    const { fragranceId, paginationParams, fill = false } = params

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

  getNotesOnSingle (params: GetFragranceNotesOnSingleParams): ResultAsync<FragranceNoteRow[], ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null
    const {
      fragranceId,
      paginationParams,
      layer,
      fill = false
    } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    const query = db
      .selectFrom('fragranceNotes as fn')
      .where('fn.fragranceId', '=', fragranceId)
      .leftJoin('fragranceNoteVotes as nv', (join) =>
        join
          .onRef('nv.fragranceNoteId', '=', 'fn.id')
          .on('nv.userId', '=', userId)
      )
      .innerJoin('notes as n', (join) =>
        join
          .onRef('n.id', '=', 'fn.noteId')
      )
      .select([
        'fn.fragranceId',
        'fn.id',
        'n.id as noteId',
        'n.name',
        'n.s3Key',
        'fn.layer',
        'fn.votes',
        'nv.id as myVote',
        'fn.createdAt',
        'fn.updatedAt',
        'fn.deletedAt',
        sql<boolean>`FALSE`.as('isFill')
      ])
      .$if(fill, qb =>
        qb
          .unionAll(
            db
              .selectFrom('notes as n2')
              .leftJoin('fragranceNotes as fn2', join =>
                join
                  .onRef('fn2.fragranceId', '=', sql<number>`${fragranceId}`)
                  .onRef('fn2.noteId', '=', 'n2.id')
              )
              .where('fn2.id', 'is', null)
              .select([
                sql<number>`${fragranceId}`.as('fragranceId'),
                'n2.id as id',
                'n2.id as noteId',
                'n2.name as name',
                'n2.s3Key',
                sql<NoteLayerEnum>`${layer}`.as('layer'),
                sql<number>`0`.as('votes'),
                sql<number | null>`null`.as('myVote'),
                'n2.createdAt',
                'n2.updatedAt',
                'n2.deletedAt',
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
      .where('layer', '=', layer)
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

  getImagesOnMultiple (params: GetFragranceImagesOnMultipleParams): ResultAsync<FragranceImageRow[], ApiError> {
    const { db } = this
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
    const { db } = this
    const userId = this.context.me?.id ?? null
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

  /*
    Getting notes on multiple fragrances does not allow fill. Use fill for a specific (getNotesOnSingle) fragrance
  */
  getNotesOnMultiple (params: GetFragranceNotesOnMultpleParams): ResultAsync<FragranceNoteRow[], ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null
    const {
      fragranceIds,
      paginationParams,
      layer
    } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragrances as f')
          .crossJoinLateral(
            (eb) => eb
              .selectFrom('fragranceNotes as fn')
              .whereRef('fn.fragranceId', '=', 'f.id')
              .leftJoin('fragranceNoteVotes as nv', (join) =>
                join
                  .onRef('nv.fragranceNoteId', '=', 'fn.id')
                  .on('nv.userId', '=', userId)
              )
              .innerJoin('notes as n', (join) =>
                join
                  .onRef('n.id', '=', 'fn.noteId')
              )
              .selectAll('fn')
              .select('nv.id as myVote')
              .select(['n.id as noteId', 'n.name', 'n.s3Key'])
              .$if(cursor.isValid, qb =>
                qb
                  .where(({ eb, or, and }) =>
                    or([
                      eb(`fn.${column}`, operator, cursor.value),
                      and([
                        eb(`fn.${column}`, '=', cursor.value),
                        eb('fn.id', operator, cursor.lastId)
                      ])
                    ])
                  )
              )
              .where('fn.layer', '=', layer)
              .orderBy(`fn.${column}`, direction)
              .orderBy('fn.id', direction)
              .limit(first + 1)
              .as('fnPage')
          )
          .selectAll('fnPage')
          .where('f.id', 'in', fragranceIds)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getReviewsOnMultiple (params: GetFragranceReviewsMultipleParams): ResultAsync<FragranceReviewRow[], ApiError> {
    const { db } = this
    const userId = this.context.me?.id ?? null
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
    const { db } = this
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
    const { db } = this
    const userId = this.context.me?.id ?? null
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
