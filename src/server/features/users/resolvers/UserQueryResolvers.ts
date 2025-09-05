import { ApiError, throwError } from '@src/utils/error'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { mapUserRowToUserSummary } from '../utils/mappers'
import { type QueryResolvers } from '@generated/gql-types'

export class UserQueryResolvers extends BaseResolver<QueryResolvers> {
  me: QueryResolvers['me'] = (
    _,
    args,
    context,
    info
  ) => {
    const { me } = context

    if (me == null) {
      throw new ApiError(
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
