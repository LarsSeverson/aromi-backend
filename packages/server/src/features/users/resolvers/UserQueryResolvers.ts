import { BackendError, throwError } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '../utils/mappers.js'
import type { QueryResolvers } from '@src/graphql/gql-types.js'

export class UserQueryResolvers extends BaseResolver<QueryResolvers> {
  me: QueryResolvers['me'] = (
    _,
    args,
    context,
    info
  ) => {
    const { me } = context

    if (me == null) {
      throw new BackendError(
        'NOT_AUTHENTICATED',
        'You are not authenticated',
        401
      )
    }

    return mapUserRowToUserSummary(me)
  }

  user: QueryResolvers['user'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context
    const { users } = services

    return await users
      .findOne(
        eb => eb('id', '=', id)
      )
      .match(
        mapUserRowToUserSummary,
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      me: this.me,
      user: this.user
    }
  }
}
