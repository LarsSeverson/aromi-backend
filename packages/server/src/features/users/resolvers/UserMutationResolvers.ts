import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '../utils/mappers.js'
import { UpdateUserSchema } from './validation.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { parseOrThrow, unwrapOrThrow } from '@aromi/shared'

export class UserMutationResolvers extends BaseResolver<MutationResolvers> {
  updateMe: MutationResolvers['updateMe'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { username } = input
    const { users } = services

    parseOrThrow(UpdateUserSchema, input)

    if (username == null) return me

    const user = await unwrapOrThrow(
      users.updateOne(
        eb => eb('id', '=', me.id),
        {
          username
        }
      )
    )

    return mapUserRowToUserSummary(user)
  }

  setMyAvatar: MutationResolvers['setMyAvatar'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { assetId } = input
    const { users, assets } = services

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
            .createOne({ name, s3Key, contentType, sizeBytes, userId: me.id })
        )

        const updated = await unwrapOrThrow(
          trx
            .updateOne(
              eb => eb('id', '=', me.id),
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
      updateMe: this.updateMe,
      setMyAvatar: this.setMyAvatar
    }
  }
}
