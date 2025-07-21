import { type UserSummary } from '@src/schemas/user/mappers'
import { type UserRow } from '@src/services/UserService'
import { ApiResolver } from './apiResolver'
import { type QueryResolvers, type UserResolvers as UserFieldResolvers } from '@src/generated/gql-types'
import { ResultAsync } from 'neverthrow'
import { mapFragranceCollectionRowToFragranceCollectionSummary } from './collectionResolver'
import { mapFragranceVoteRowToFragranceVoteSummary } from './fragranceVoteResolver'
import { mapFragranceReviewRowToFragranceReviewSummary } from './reviewResolvers'
import { throwError } from '@src/common/error'

export class UserResolver extends ApiResolver {
  me: QueryResolvers['me'] = (parent, args, context, info) => {
    return context.me ?? null
  }

  user: QueryResolvers['user'] = async (parent, args, context, info) => {
    const { id } = args
    const { services } = context

    return await services
      .user
      .findOne(eb => eb('users.id', '=', id))
      .match(
        mapUserRowToUserSummary,
        throwError
      )
  }

  userCollections: UserFieldResolvers['collections'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const processed = this.paginationFactory.process(input, 'UPDATED')

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getCollectionsLoader({ pagination: processed })
          .load({ userId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            processed,
            (row) => String(row[processed.column]),
            mapFragranceCollectionRowToFragranceCollectionSummary
          ),
        throwError
      )
  }

  userLikes: UserFieldResolvers['likes'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const processed = this.paginationFactory.process(input, 'UPDATED')

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getLikesLoader({ pagination: processed })
          .load({ userId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            processed,
            (row) => String(row[processed.column]),
            mapFragranceVoteRowToFragranceVoteSummary
          ),
        throwError
      )
  }

  userReviews: UserFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const processed = this.paginationFactory.process(input, 'UPDATED')

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getReviewsLoader({ pagination: processed })
          .load({ userId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            processed,
            (row) => String(row[processed.column]),
            mapFragranceReviewRowToFragranceReviewSummary
          ),
        throwError
      )
  }
}

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
    username: username ?? email,
    followerCount,
    followingCount,

    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}
