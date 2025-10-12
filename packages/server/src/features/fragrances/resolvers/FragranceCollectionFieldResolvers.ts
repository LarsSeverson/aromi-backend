import { BackendError, unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { FragranceCollectionResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class FragranceCollectionFieldResolvers extends BaseResolver<FragranceCollectionResolvers> {
  items: FragranceCollectionResolvers['items'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { loaders } = context

    const { fragrances } = loaders

    const rows = await unwrapOrThrow(fragrances.collections.loadItems(id))

    return rows
  }

  previewItems: FragranceCollectionResolvers['previewItems'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { loaders } = context

    const { fragrances } = loaders

    const rows = await unwrapOrThrow(fragrances.collections.loadPreviewItems(id))

    return rows
  }

  hasFragrance: FragranceCollectionResolvers['hasFragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { fragranceId } = args
    const { services } = context

    const { users } = services

    const res = await users
      .collections
      .items
      .findFragrances(
        where => where.and([
          where('collectionId', '=', id),
          where('fragranceId', '=', fragranceId)
        ])
      )

    return res.isOk() && res.value.length > 0
  }

  user: FragranceCollectionResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { loaders } = context

    const { users } = loaders

    const user = await unwrapOrThrow(users.load(userId))

    if (user == null) {
      throw new BackendError(
        'USER_NOT_FOUND',
        'The user for this collection was not found.',
        404
      )
    }

    return mapUserRowToUserSummary(user)
  }

  getResolvers (): FragranceCollectionResolvers {
    return {
      items: this.items,
      previewItems: this.previewItems,
      hasFragrance: this.hasFragrance,
      user: this.user
    }
  }
}