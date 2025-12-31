import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapUserRowToUserSummary } from '../utils/mappers.js'
import { UpdateUserSchema } from './validation.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BackendError, INDEXATION_JOB_NAMES, parseOrThrow, unwrapOrThrow } from '@aromi/shared'

export class UserMutationResolvers extends BaseResolver<MutationResolvers> {
  updateMe: MutationResolvers['updateMe'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { queues, services } = context
    const me = this.checkAuthenticated(context)

    const { username } = input
    const { indexations } = queues
    const { users } = services

    parseOrThrow(UpdateUserSchema, input)

    if (username == null) return me

    const user = await unwrapOrThrow(
      users.updateOne(
        where => where('id', '=', me.id),
        {
          username
        }
      )
    )

    await indexations.enqueue({
      jobName: INDEXATION_JOB_NAMES.UPDATE_USER,
      data: { userId: user.id }
    })

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
        .findOne(
          where => where.and([
            where('id', '=', assetId),
            where('userId', '=', me.id)
          ])
        )
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

  follow: MutationResolvers['follow'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { userId } = input
    const { users } = services

    if (me.id === userId) {
      throw new BackendError(
        'BAD_REQUEST',
        'You cannot follow yourself.',
        400
      )
    }

    const follow = await unwrapOrThrow(
      users.follows.upsert(
        { followerId: me.id, followedId: userId },
        oc => oc
          .columns(['followerId', 'followedId'])
          .doUpdateSet({ deletedAt: null, updatedAt: new Date().toISOString() })
      )
    )

    const user = await unwrapOrThrow(
      users.findOne(eb => eb('id', '=', userId))
    )

    return {
      ...follow,
      id: `following:${follow.followedId}`,
      userId: user.id
    }
  }

  unfollow: MutationResolvers['unfollow'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { userId } = input
    const { users } = services

    if (me.id === userId) {
      throw new BackendError(
        'BAD_REQUEST',
        'You cannot unfollow yourself.',
        400
      )
    }

    const follow = await unwrapOrThrow(
      users.follows.softDeleteOne(
        where => where.and([
          where('followerId', '=', me.id),
          where('followedId', '=', userId)
        ])
      )
    )

    const user = await unwrapOrThrow(
      users.findOne(eb => eb('id', '=', userId))
    )

    return {
      ...follow,
      id: `following:${follow.followedId}`,
      userId: user.id
    }
  }

  getResolvers (): MutationResolvers {
    return {
      updateMe: this.updateMe,
      setMyAvatar: this.setMyAvatar,
      follow: this.follow,
      unfollow: this.unfollow
    }
  }
}
