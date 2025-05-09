import { ApiError } from '@src/common/error'
import { type PaginationParams } from '@src/common/pagination'
import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources/datasources'
import { type FragranceImage, type Fragrance } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'

export type FragranceRow = Selectable<Fragrance> & { myVote: number | null }
export type FragranceImageRow = Selectable<FragranceImage>

export class FragranceService {
  me?: ApiContext['me']

  constructor (private readonly sources: ApiDataSources) {}

  // TODO: Explore builder pattern
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

  getByCollectionIds (ids: number[]): ResultAsync<Array<FragranceRow & { collectionId: number }>, ApiError> {
    const { db } = this.sources
    const userId = this.me?.id ?? null

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('collectionFragrances as cf')
          .innerJoin('fragrances as f', 'f.id', 'cf.fragranceId')
          .leftJoin('fragranceVotes as fv', (join) =>
            join
              .onRef('fv.fragranceId', '=', 'f.id')
              .on('fv.userId', '=', userId)
              .on('fv.deletedAt', 'is', null)
          )
          .selectAll('f')
          .select('fv.vote as myVote')
          .select('cf.id as collectionId')
          .where('cf.id', 'in', ids)
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

  getImagesByFragranceIds (fragranceIds: number[], params: PaginationParams): ResultAsync<FragranceImageRow[], ApiError> {
    const { db } = this.sources

    const { first, cursor, sortParams } = params
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
        error => { throw error }
      )
  }
}
