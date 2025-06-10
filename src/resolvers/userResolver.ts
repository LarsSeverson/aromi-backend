import { type UserSummary } from '@src/schemas/user/mappers'
import { type UserRow } from '@src/services/UserService'
import { ApiResolver, SortByColumn } from './apiResolver'
import { type QueryResolvers, type UserResolvers as UserFieldResolvers } from '@src/generated/gql-types'
import { ResultAsync } from 'neverthrow'
import { mapFragranceCollectionRowToFragranceCollectionSummary } from './collectionResolver'
import { mapFragranceVoteRowToFragranceVoteSummary } from './fragranceVoteResolver'
import { mapFragranceReviewRowToFragranceReviewSummary } from './reviewResolvers'

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
        error => { throw error }
      )
  }

  userCollections: UserFieldResolvers['collections'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const normalizedInput = this
      .paginationFactory
      .normalize(input, input?.sort?.by ?? 'UPDATED', (decoded) => String(decoded))

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => SortByColumn[normalizedInput.sort.by])

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getCollectionsLoader({ pagination: parsedInput })
          .load({ userId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row) => row[parsedInput.column],
            mapFragranceCollectionRowToFragranceCollectionSummary
          ),
        error => { throw error }
      )
  }

  userLikes: UserFieldResolvers['likes'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const normalizedInput = this
      .paginationFactory
      .normalize(input, input?.sort?.by ?? 'UPDATED', (decoded) => String(decoded))

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => SortByColumn[normalizedInput.sort.by])

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getLikesLoader({ pagination: parsedInput })
          .load({ userId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row) => String(row[parsedInput.column]),
            mapFragranceVoteRowToFragranceVoteSummary
          ),
        error => { throw error }
      )
  }

  userReviews: UserFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const normalizedInput = this
      .paginationFactory
      .normalize(input, input?.sort?.by ?? 'UPDATED', (decoded) => String(decoded))

    const parsedInput = this
      .paginationFactory
      .parse(normalizedInput, () => SortByColumn[normalizedInput.sort.by])

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getReviewsLoader({ pagination: parsedInput })
          .load({ userId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row) => row[parsedInput.column],
            mapFragranceReviewRowToFragranceReviewSummary
          ),
        error => { throw error }
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
