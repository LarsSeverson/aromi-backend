import { type UserSummary } from '@src/schemas/user/mappers'
import { type UserRow } from '@src/services/UserService'
import { ApiResolver } from './apiResolver'
import { type MutationResolvers, type QueryResolvers, type UserResolvers as UserFieldResolvers } from '@src/generated/gql-types'
import { ResultAsync } from 'neverthrow'
import { mapFragranceCollectionRowToFragranceCollectionSummary } from './collectionResolver'
import { mapFragranceVoteRowToFragranceVoteSummary } from './fragranceVoteResolver'
import { mapFragranceReviewRowToFragranceReviewSummary } from './reviewResolvers'
import { ApiError, throwError } from '@src/common/error'
import z from 'zod'
import { parseSchema } from '@src/common/schema'
import { PRESIGN_AVATAR_KEY } from '@src/datasources/s3'

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

  presignUserAvatar: MutationResolvers['presignUserAvatar'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    parseSchema(PresignUserAvatarInputSchema, input)

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before updating your avatar',
        403
      )
    }

    const {
      userId,
      fileName,
      fileSize,
      fileType
    } = input

    const key = PRESIGN_AVATAR_KEY(userId, fileName)

    return await services
      .asset
      .presignUpload({ key, fileSize, fileType })
      .match(
        payload => payload,
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

export const PresignUserAvatarInputSchema = z
  .object({
    fileType: z
      .string()
      .regex(
        /^image\/(jpeg|png|webp)$/,
        'File type must be JPEG, PNG, or WEBP image'
      ),
    fileSize: z
      .number()
      .int({ error: 'File size must be an integer' })
      .positive({ error: 'File size mus be greater than 0' })
      .max(
        5 * 1024 * 1024, // 5 MB max
        'File size must be 5MB or less'
      )
  })
