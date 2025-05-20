import { ApiError } from '@src/common/error'
import { type UserCollection, type User } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { ApiService, type ServiceFindCriteria } from './apiService'
import { type PaginationParams } from '@src/common/pagination'

export type UserRow = Selectable<User>
export type UserCollectionRow = Selectable<UserCollection>

export class UserService extends ApiService<'users'> {
  find (criteria: ServiceFindCriteria<'users'>): ResultAsync<UserRow, ApiError> {
    const { db } = this

    const query = this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => {
          const op = this.operand(value)
          return qb.where(column, op, value)
        },
        db
          .selectFrom('users')
          .selectAll()
      )

    return ResultAsync
      .fromPromise(
        query.executeTakeFirstOrThrow(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  findAll (criteria: ServiceFindCriteria<'users'>): ResultAsync<UserRow[], ApiError> {
    const { db } = this

    const query = this
      .entries(criteria)
      .reduce(
        (qb, [column, value]) => {
          const op = this.operand(value)
          return qb.where(column, op, value)
        },
        db
          .selectFrom('users')
          .selectAll()
      )

    return ResultAsync
      .fromPromise(
        query.execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }

  list (params: PaginationParams): ResultAsync<UserRow[], ApiError> {
    const { db } = this

    const { first, cursor, sortParams } = params
    const { column, operator, direction } = sortParams

    return ResultAsync
      .fromPromise(
        db
          .selectFrom('users as u')
          .selectAll('u')
          .$if(cursor.isValid, qb =>
            qb
              .where(({ eb, or, and }) =>
                or([
                  eb(`u.${column}`, operator, cursor.value),
                  and([
                    eb(`u.${column}`, '=', cursor.value),
                    eb('u.id', operator, cursor.lastId)
                  ])
                ])
              )
          )
          .orderBy(`u.${column}`, direction)
          .orderBy('u.id', direction)
          .limit(first + 1)
          .execute(),
        error => ApiError.fromDatabase(error as Error)
      )
  }
}
