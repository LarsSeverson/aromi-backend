import { BackendError, unwrapOrThrow } from '@aromi/shared'
import type { UserFollowResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '../utils/mappers.js'

export class UserFollowFieldResolvers extends BaseResolver<UserFollowResolvers> {
  user: UserFollowResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { loaders } = context
    const { users } = loaders

    const userRow = await unwrapOrThrow(users.load(userId))

    if (userRow == null) {
      throw new BackendError(
        'NOT_FOUND',
        'User not found',
        404
      )
    }

    return mapUserRowToUserSummary(userRow)
  }

  getResolvers (): UserFollowResolvers {
    return {
      user: this.user
    }
  }
}