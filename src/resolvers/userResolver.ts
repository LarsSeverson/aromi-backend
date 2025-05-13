import { extractPaginationParams } from '@src/common/pagination'
import { type QueryResolvers, type UserResolvers as UserFieldResolvers } from '@src/generated/gql-types'
import { type UserCollectionSummary, type UserSummary } from '@src/schemas/user/mappers'
import { type UserCollectionRow, type UserRow } from '@src/services/userService'
import { ApiResolver } from './apiResolver'

export class UserResolver extends ApiResolver {
  me: QueryResolvers['me'] = (parent, args, context, info) => {
    return context.me ?? null
  }

  user: QueryResolvers['user'] = async (parent, args, context, info) => {
    const { id } = args
    const { services } = context

    return await services
      .user
      .find({ id })
      .match(
        row => mapUserRowToUserSummary(row),
        error => { throw error }
      )
  }

  // TODO: If ever list of users in base query, then this will need to use a loader
  userCollections: UserFieldResolvers['collections'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const paginationParams = extractPaginationParams(input)

    return await services
      .collection
      .findAllPaginated({ criteria: { userId: id }, paginationParams })
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: (row) => this.mapUserCollectionRowToUserCollectionSummary(row)
          }),
        error => { throw error }
      )
  }

  private mapUserCollectionRowToUserCollectionSummary (row: UserCollectionRow): UserCollectionSummary {
    const {
      id,
      name,
      createdAt, updatedAt, deletedAt
    } = row

    return {
      id,
      name,
      audit: {
        createdAt,
        updatedAt,
        deletedAt
      }
    }
  }
}

// This is outside the class for a reason. See auth middleware
export const mapUserRowToUserSummary = (row: UserRow): UserSummary => {
  const {
    id,
    email, username,
    followerCount, followingCount,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    email,
    username,
    followerCount,
    followingCount,

    audit: {
      createdAt,
      updatedAt,
      deletedAt
    }
  }
}
