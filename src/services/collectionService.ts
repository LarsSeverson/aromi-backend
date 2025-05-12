import { type PaginationParams } from '@src/common/pagination'
import { type UserCollection } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { ApiService } from './apiService'
import { ResultAsync } from 'neverthrow'
import { ApiError } from '@src/common/error'

export type UserCollectionRow = Selectable<UserCollection>

export interface GetUserCollectionParams {
  userId: number
  paginationParams: PaginationParams
}

export interface GetCollectionItemsParams {
  fragranceIds: number[]
  paginationParams: PaginationParams
}

export class CollectionService extends ApiService<'userCollections'> {
  getUserCollections (params: GetUserCollectionParams): ResultAsync<UserCollectionRow[], ApiError> {
    const { db } = this
    const { userId, paginationParams } = params

    const { first, cursor, sortParams } = paginationParams
    const { column, operator, direction } = sortParams

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('userCollections as uc')
          .where('uc.userId', '=', userId)
          .selectAll('uc')
          .$if(cursor.isValid, qb =>
            qb
              .where(({ eb, or, and }) =>
                or([
                  eb(`uc.${column}`, operator, cursor.value),
                  and([
                    eb(`uc.${column}`, '=', cursor.value),
                    eb('uc.id', operator, cursor.lastId)
                  ])
                ])
              )
          )
          .orderBy(`uc.${column}`, direction)
          .orderBy('uc.id', direction)
          .limit(first + 1)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
