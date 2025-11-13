import { BackendError, unwrapOrThrow } from '@aromi/shared'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'
import type { FragranceCollectionResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceCollectionItemPaginationFactory } from '../factories/FragranceCollectionItemPaginationFactory.js'

export class FragranceCollectionFieldResolvers extends BaseResolver<FragranceCollectionResolvers> {
  private readonly pagination = new FragranceCollectionItemPaginationFactory()

  items: FragranceCollectionResolvers['items'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const { fragrances } = services
    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(
      fragrances.collections.items.find(
        where => where('collectionId', '=', id),
        { pagination }
      )
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
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
    const { loaders } = context

    const { fragrances } = loaders

    const hasFragrance = await unwrapOrThrow(fragrances.collections.loadHasFragrance(id, fragranceId))

    return hasFragrance
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

  info: FragranceCollectionResolvers['info'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragrances } = services

    const itemCount = await unwrapOrThrow(
      fragrances.collections.items.count(
        where => where('collectionId', '=', id)
      )
    )

    return {
      itemCount
    }
  }

  getResolvers (): FragranceCollectionResolvers {
    return {
      items: this.items,
      previewItems: this.previewItems,
      hasFragrance: this.hasFragrance,
      user: this.user,
      info: this.info
    }
  }
}