import { ApiError } from '@src/common/error'
import { type ApiContext } from '@src/context'
import { type ApiDataSources } from '@src/datasources'
import { type Fragrance } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

export type FragranceRow = Selectable<Fragrance> & { myVote: number | null }

export class FragranceService {
  me?: ApiContext['me']

  constructor (private readonly sources: ApiDataSources) {}

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
          .executeTakeFirst(),
        error => ApiError.fromDatabase(error as Error)
      )
      .andThen(row => {
        if (row == null) return errAsync(new ApiError('NOT_FOUND', 'Fragrance not found', 404))
        return okAsync(row)
      })
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

  // list (input?: PaginationInput): ResultAsync<FragranceRow, ApiError> {
  //   const { db } = this.sources

  //   const { first, after, sort } = getPaginationInput(input)
  // }
}
