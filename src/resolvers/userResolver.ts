import { extractPaginationParams } from '@src/common/pagination'
import { type QueryResolvers, type UserResolvers as UserFieldResolvers } from '@src/generated/gql-types'
import { type UserSummary } from '@src/schemas/user/mappers'
import { ApiResolver } from './apiResolver'
import { type FragranceReviewRow } from '@src/services/reviewService'
import { mapFragranceRowToFragranceSummary } from './fragranceResolver'
import { type FragranceCollectionSummary, type FragranceReviewSummary } from '@src/schemas/fragrance/mappers'
import { type UserRow } from '@src/services/userService'
import { type FragranceCollectionRow } from '@src/services/collectionService'

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
            mapFn: mapFragranceCollectionRowToFragranceCollectionSummary
          }),
        error => { throw error }
      )
  }

  userReviews: UserFieldResolvers['reviews'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const paginationParams = extractPaginationParams(input)

    return await services
      .review
      .findAllPaginated({ criteria: { userId: id }, paginationParams })
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: mapFragranceReviewRowToFragranceReviewSummary
          }),
        error => { throw error }
      )
  }

  userLikes: UserFieldResolvers['likes'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const paginationParams = extractPaginationParams(input)

    return await services
      .fragrance
      .getLiked({ userId: id, paginationParams })
      .match(
        rows => this
          .mapToPage({
            rows,
            paginationParams,
            mapFn: mapFragranceRowToFragranceSummary
          }),
        error => { throw error }
      )
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

export const mapFragranceCollectionRowToFragranceCollectionSummary = (row: FragranceCollectionRow): FragranceCollectionSummary => {
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

export const mapFragranceReviewRowToFragranceReviewSummary = (row: FragranceReviewRow): FragranceReviewSummary => {
  const {
    id,
    rating, reviewText,
    voteScore, likesCount, dislikesCount, myVote,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    rating,
    text: reviewText,
    votes: {
      score: voteScore,
      likesCount,
      dislikesCount,
      myVote: myVote === 1 ? true : myVote === -1 ? false : null
    },
    audit: {
      createdAt,
      updatedAt,
      deletedAt
    }
  }
}
