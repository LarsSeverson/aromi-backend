import { type DB } from '@src/db/schema'
import { type Selectable } from 'kysely'
import { TableService } from './TableService'
import { type ApiDataSources } from '@src/datasources/datasources'

export type UserRow = Selectable<DB['users']>

export class UserService extends TableService<'users', UserRow> {
  constructor (sources: ApiDataSources) {
    super(sources, 'users')
  }
  // create (
  //   data: Partial<UserRow> & { email: string, cognitoId: string }
  // ): ResultAsync<UserRow, ApiError> {
  //   return ResultAsync
  //     .fromPromise(
  //       this
  //         .db
  //         .insertInto('users')
  //         .values(data)
  //         .returningAll()
  //         .executeTakeFirstOrThrow(),
  //       error => ApiError.fromDatabase(error as Error)
  //     )
  // }

  // find (
  //   criteria: ServiceFindCriteria<'users'>
  // ): ResultAsync<UserRow, ApiError> {
  //   return ResultAsync
  //     .fromPromise(
  //       this
  //         .baseQuery(criteria)
  //         .executeTakeFirstOrThrow(),
  //       error => ApiError.fromDatabase(error as Error)
  //     )
  // }

  // findAll (
  //   criteria: ServiceFindCriteria<'users'>
  // ): ResultAsync<UserRow[], ApiError> {
  //   return ResultAsync
  //     .fromPromise(
  //       this
  //         .baseQuery(criteria)
  //         .execute(),
  //       error => ApiError.fromDatabase(error as Error)
  //     )
  // }

  // list (
  //   params: PaginationParams
  // ): ResultAsync<UserRow[], ApiError> {
  //   const { db } = this

  //   const { first, cursor, sortParams } = params
  //   const { column, operator, direction } = sortParams

  //   return ResultAsync
  //     .fromPromise(
  //       db
  //         .selectFrom('users as u')
  //         .selectAll('u')
  //         .$if(cursor.isValid, qb =>
  //           qb
  //             .where(({ eb, or, and }) =>
  //               or([
  //                 eb(`u.${column}`, operator, cursor.value),
  //                 and([
  //                   eb(`u.${column}`, '=', cursor.value),
  //                   eb('u.id', operator, cursor.lastId)
  //                 ])
  //               ])
  //             )
  //         )
  //         .orderBy(`u.${column}`, direction)
  //         .orderBy('u.id', direction)
  //         .limit(first + 1)
  //         .execute(),
  //       error => ApiError.fromDatabase(error as Error)
  //     )
  // }

  // build (critera?: ServiceFindCriteria<'users'>): SelectQueryBuilder<DB, 'users', UserRow> {
  //   return this.baseQuery(critera)
  // }

  // private baseQuery (criteria?: ServiceFindCriteria<'users'>): SelectQueryBuilder<DB, 'users', UserRow> {
  //   const { db } = this

  //   const base = db
  //     .selectFrom('users')
  //     .selectAll()

  //   if (criteria == null) return base

  //   return this
  //     .entries(criteria)
  //     .reduce(
  //       (qb, [column, value]) => qb.where(column, this.operand(value), value),
  //       base
  //     )
  // }
}
