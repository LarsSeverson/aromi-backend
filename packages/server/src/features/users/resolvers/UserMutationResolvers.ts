import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '../utils/mappers.js'
import { UpdateUserSchema } from './validation.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BackendError, parseOrThrow, throwError, unwrapOrThrow } from '@aromi/shared'

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

  setUserAvatar: MutationResolvers['setUserAvatar'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { userId, assetId } = input
    const { users, assets } = services

    if (me.id !== userId) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to edit this users info',
        403
      )
    }

    const asset = await unwrapOrThrow(
      assets
        .uploads
        .findOne(eb => eb('id', '=', assetId))
    )

    const user = await unwrapOrThrow(users.withTransactionAsync(
      async trx => {
        const { name, s3Key, contentType, sizeBytes } = asset

        const image = await unwrapOrThrow(
          trx
            .images
            .createOne({ name, s3Key, contentType, sizeBytes, userId })
        )

        const updated = await unwrapOrThrow(
          trx
            .updateOne(
              eb => eb('id', '=', userId),
              { avatarId: image.id }
            )
        )

        return updated
      })
    )

    return mapUserRowToUserSummary(user)
  }

  getResolvers (): MutationResolvers {
    return {
      updateUser: this.updateUser,
      setUserAvatar: this.setUserAvatar
    }
  }
}
