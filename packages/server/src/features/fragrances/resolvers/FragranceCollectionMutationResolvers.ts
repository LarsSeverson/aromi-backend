import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceCollectionItemMutationResolvers } from './FragranceCollectionItemMutationResolvers.js'
import { BackendError, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import { CreateCollectionInputSchema, UpdateCollectionInputSchema } from '../utils/validation.js'

export class FragranceCollectionMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly items = new FragranceCollectionItemMutationResolvers()

  createFragranceCollection: MutationResolvers['createFragranceCollection'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const parsed = parseOrThrow(CreateCollectionInputSchema, input)
    const { users } = services

    const collection = await unwrapOrThrow(
      users.collections.createOne({ ...parsed, userId: me.id })
    )

    return collection
  }

  updateFragranceCollection: MutationResolvers['updateFragranceCollection'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { collectionId } = input

    const { users } = services

    const collection = await unwrapOrThrow(
      users.collections.findOne(where => where('id', '=', collectionId))
    )

    if (collection.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to update this collection.',
        403
      )
    }

    const parsed = parseOrThrow(UpdateCollectionInputSchema, input)
    const values = {
      ...parsed,
      updatedAt: new Date().toISOString()
    }

    const updated = await unwrapOrThrow(
      users.collections.updateOne(
        where => where('id', '=', collectionId),
        values
      )
    )

    return updated
  }

  deleteFragranceCollection: MutationResolvers['deleteFragranceCollection'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { services } = context
    const { input } = args
    const me = this.checkAuthenticated(context)

    const { collectionId } = input
    const { users } = services

    const collection = await unwrapOrThrow(
      users.collections.findOne(where => where('id', '=', collectionId))
    )

    if (collection.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to delete this collection.',
        403
      )
    }

    const deleted = await unwrapOrThrow(
      users.collections.softDeleteOne(where => where('id', '=', collectionId))
    )

    return deleted
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.items.getResolvers(),
      createFragranceCollection: this.createFragranceCollection,
      updateFragranceCollection: this.updateFragranceCollection,
      deleteFragranceCollection: this.deleteFragranceCollection
    }
  }
}