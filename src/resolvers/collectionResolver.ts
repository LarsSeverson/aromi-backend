import { type MutationResolvers, type FragranceCollectionResolvers as CollectionFieldResolvers, type FragranceCollectionItemResolvers as CollectionItemFieldResolvers, type QueryResolvers } from '@src/generated/gql-types'
import { ApiResolver, SortByColumn } from './apiResolver'
import { ResultAsync } from 'neverthrow'
import { type FragranceCollectionSummary, type FragranceCollectionItemSummary } from '@src/schemas/fragrance/mappers'
import { type FragranceCollectionItemRow, type FragranceCollectionRow } from '@src/services/repositories/FragranceCollectionRepo'
import { mapFragranceRowToFragranceSummary } from './fragranceResolver'
import { mapUserRowToUserSummary } from './userResolver'
import { ApiError } from '@src/common/error'

export class CollectionResolver extends ApiResolver {
  collection: QueryResolvers['collection'] = async (parent, args, context, info) => {
    const { id } = args
    const { services } = context

    return await services
      .fragrance
      .collections
      .findOne(eb => eb('fragranceCollections.id', '=', id))
      .match(
        mapFragranceCollectionRowToFragranceCollectionSummary,
        error => { throw error }
      )
  }

  collectionUser: CollectionFieldResolvers['user'] = async (parent, args, context, info) => {
    const { userId } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .user
          .getUserLoader()
          .load({ userId }),
        error => error
      )
      .match(
        mapUserRowToUserSummary,
        error => { throw error }
      )
  }

  collectionItems: CollectionFieldResolvers['items'] = async (parent, args, context, info) => {
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
          .collection
          .getItemsLoader({ pagination: parsedInput })
          .load({ collectionId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            parsedInput,
            (row) => row[parsedInput.column],
            mapCollectionItemRowToCollectionItemSummary
          ),
        error => { throw error }
      )
  }

  collectionHasFragrance: CollectionFieldResolvers['hasFragrance'] = async (parent, args, context, info) => {
    const { id } = parent
    const { fragranceId } = args
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .collection
          .getHasFragranceLoader({ fragranceId })
          .load({ collectionId: id }),
        error => error
      )
      .match(
        yes => yes,
        error => { throw error }
      )
  }

  itemFragrance: CollectionItemFieldResolvers['fragrance'] = async (parent, args, context, info) => {
    const { fragranceId } = parent
    const { loaders } = context

    return await ResultAsync
      .fromPromise(
        loaders
          .fragrance
          .getFragranceLoader()
          .load({ fragranceId }),
        error => error
      )
      .match(
        mapFragranceRowToFragranceSummary,
        error => { throw error }
      )
  }

  createCollection: MutationResolvers['createFragranceCollection'] = async (_, args, context, info) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to sign up or log in before creating a collection',
        403
      )
    }

    const userId = me.id
    const { name } = input

    return await services
      .fragrance
      .collections
      .create({ name, userId })
      .match(
        mapFragranceCollectionRowToFragranceCollectionSummary,
        error => { throw error }
      )
  }

  createCollectionItem: MutationResolvers['createFragranceCollectionItem'] = async (_, args, context, info) => {
    const { input } = args
    const { services } = context

    const { fragranceId, collectionId } = input

    return await services
      .fragrance
      .collections
      .items
      .create({ fragranceId, collectionId })
      .match(
        mapCollectionItemRowToCollectionItemSummary,
        error => { throw error }
      )
  }
}

export const mapFragranceCollectionRowToFragranceCollectionSummary = (row: FragranceCollectionRow): FragranceCollectionSummary => {
  const {
    id, userId,
    name,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    userId,
    name,
    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}

export const mapCollectionItemRowToCollectionItemSummary = (row: FragranceCollectionItemRow): FragranceCollectionItemSummary => {
  const {
    id, fragranceId,
    rank,
    createdAt, updatedAt, deletedAt
  } = row

  return {
    id,
    fragranceId,
    rank: Number(rank),
    audit: ApiResolver.audit(createdAt, updatedAt, deletedAt)
  }
}
