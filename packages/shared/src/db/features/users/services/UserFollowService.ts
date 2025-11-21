import { FeaturedTableService } from '@src/db/services/FeaturedTableService.js'
import type { UserFollowRow } from '../types.js'
import type { DataSources } from '@src/datasources/DataSources.js'
import { ResultAsync } from 'neverthrow'
import { BackendError } from '@src/utils/error.js'
import type { ExpressionOrFactory, SqlBool } from 'kysely'
import type { DB } from '@src/db/db-schema.js'
import type { QueryOptions } from '@src/db/types.js'

export class UserFollowService extends FeaturedTableService<UserFollowRow> {
  constructor (sources: DataSources) {
    super(sources, 'userFollows')
  }

  findFollowers <C>(
    where?: ExpressionOrFactory<DB, 'userFollows', SqlBool>,
    options?: QueryOptions<C, 'userFollows', UserFollowRow>
  ) {

    const query = this.Table
      .find(where)
      .innerJoin('users', 'userFollows.followerId', 'users.id')
      .selectAll('users')
      .where('userFollows.deletedAt', 'is', null)
      .where('users.deletedAt', 'is', null)

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }

  findFollowing (where?: ExpressionOrFactory<DB, 'userFollows', SqlBool>) {
    const query = this.Table
      .find(where)
      .innerJoin('users', 'userFollows.followedId', 'users.id')
      .selectAll('users')
      .where('userFollows.deletedAt', 'is', null)
      .where('users.deletedAt', 'is', null)

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }

  getRelationships (
    userId: string,
    targetUserIds: string[]
  ) {
    const query = this.build()
      .selectFrom('userFollows')
      .select(['followerId', 'followedId'])
      .where(where => where
        .and([
          where('deletedAt', 'is', null),
          where.or([
            where.and([
              where('followerId', '=', userId),
              where('followedId', 'in', targetUserIds)
            ]),
            where.and([
              where('followerId', 'in', targetUserIds),
              where('followedId', '=', userId)
            ])
          ])
        ])
      )

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }

  countFollowers (userIds: string[]) {
    const query = this.build()
      .selectFrom('userFollows')
      .select(['followedId', eb => eb.fn.countAll<number>().as('count')])
      .where('followedId', 'in', userIds)
      .where('deletedAt', 'is', null)
      .groupBy('followedId')

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }

  countFollowing (userIds: string[]) {
    const query = this.build()
      .selectFrom('userFollows')
      .select(['followerId', eb => eb.fn.countAll<number>().as('count')])
      .where('followerId', 'in', userIds)
      .where('deletedAt', 'is', null)
      .groupBy('followerId')

    return ResultAsync.fromPromise(
      query.execute(),
      error => BackendError.fromDatabase(error)
    )
  }
}