import { BackendError, throwError, unwrapOrThrow } from '@aromi/shared'
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

  searchUsers: QueryResolvers['searchUsers'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const { search } = services

    const { term, pagination } = input ?? {}
    const offsetPagination = this.searchPagination.parse(pagination)

    const { users } = search

    const { hits } = await unwrapOrThrow(users.search({ term, pagination: offsetPagination }))

    const connection = this.searchPageFactory.paginate(hits, offsetPagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      me: this.me,
      user: this.user,
      searchUsers: this.searchUsers
    }
  }
}
