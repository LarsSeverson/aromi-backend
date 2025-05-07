import { ApiError } from '@src/common/error'
import { type ApiDataSources } from '@src/datasources'
import { type User } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'

export type UserRow = Selectable<User>

export class UserService {
  constructor (private readonly sources: ApiDataSources) {}

  // Reads
  getByIds (ids: number[]): ResultAsync<UserRow[], ApiError> {
    const { db } = this.sources

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('users')
          .selectAll()
          .where('id', 'in', ids)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getByReviewIds (ids: number[]): ResultAsync<Array<UserRow & { reviewId: number }>, ApiError> {
    const { db } = this.sources

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragranceReviews as fr')
          .innerJoin('users as u', 'u.id', 'fr.userId')
          .selectAll('u')
          .select('fr.id as reviewId')
          .where('fr.id', 'in', ids)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  getByCollectionIds (ids: number[]): ResultAsync<Array<UserRow & { collectionId: number }>, ApiError> {
    const { db } = this.sources

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('fragranceCollections as fc')
          .innerJoin('users as u', 'u.id', 'fc.userId')
          .selectAll('u')
          .select('fc.id as collectionId')
          .where('fc.id', 'in', ids)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  // Writes

  // Private
}
