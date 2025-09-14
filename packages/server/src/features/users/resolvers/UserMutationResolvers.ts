import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '../utils/mappers.js'
import { UpdateUserSchema } from './validation.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BackendError, genAvatarUploadKey, parseOrThrow, throwError } from '@aromi/shared'

export class UserMutationResolvers extends BaseResolver<MutationResolvers> {
  updateUser: MutationResolvers['updateUser'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { id, username } = input
    const { me, services } = context
    const { users } = services

    parseOrThrow(UpdateUserSchema, input)

    if (me?.id !== id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to edit this users info',
        403
      )
    }

    if (username == null) return me

    return await users
      .updateOne(
        eb => eb('id', '=', id),
        {
          username
        }
      )
      .match(
        mapUserRowToUserSummary,
        throwError
      )
  }

  updateUserAvatar: MutationResolvers['updateUserAvatar'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { contentType, contentSize } = input
    const { me, services } = context
    const { assets, users } = services

    if (me == null) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You need to log in or sign up before updating your avatar',
        403
      )
    }

    const { id, key } = genAvatarUploadKey(me.id)

    return await users
      .updateOne(
        eb => eb('id', '=', me.id),
        {
          avatarStatus: 'PENDING'
        }
      )
      .andThen(() => assets
        .getPresignedUrl({ key, contentType, maxSizeBytes: contentSize })
      )
      .match(
        presigned => ({ ...presigned, id }),
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      updateUser: this.updateUser,
      updateUserAvatar: this.updateUserAvatar
    }
  }
}
