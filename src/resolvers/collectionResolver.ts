import { type MutationResolvers, type FragranceCollectionResolvers as CollectionFieldResolvers, type FragranceCollectionItemResolvers as CollectionItemFieldResolvers, type QueryResolvers } from '@src/generated/gql-types'
import { ApiResolver } from './apiResolver'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { type FragranceCollectionSummary, type FragranceCollectionItemSummary } from '@src/schemas/fragrance/mappers'
import { type FragranceCollectionItemRow, type FragranceCollectionRow } from '@src/services/repositories/FragranceCollectionRepo'
import { mapFragranceRowToFragranceSummary } from './fragranceResolver'
import { mapUserRowToUserSummary } from './userResolver'
import { ApiError, throwError } from '@src/common/error'
import { z } from 'zod'
import { parseSchema } from '@src/common/schema'

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
        throwError
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
        throwError
      )
  }

  collectionItems: CollectionFieldResolvers['items'] = async (parent, args, context, info) => {
    const { id } = parent
    const { input } = args
    const { loaders } = context

    const processed = this.pagination.process(input)
    processed.column = 'rank'

    return await ResultAsync
      .fromPromise(
        loaders
          .collection
          .getItemsLoader({ pagination: processed })
          .load({ collectionId: id }),
        error => error
      )
      .match(
        rows => this
          .newPage(
            rows,
            processed,
            (row) => String(row.rank),
            mapCollectionItemRowToCollectionItemSummary
          ),
        throwError
      )
  }

  collectionHasFragrance: CollectionFieldResolvers['hasFragrance'] = async (parent, args, context, info) => {
    const { id } = parent
    const { fragranceId } = args
    const { loaders } = context

    if (fragranceId == null) return false

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
        throwError
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
        throwError
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
        throwError
      )
  }

  createCollectionItem: MutationResolvers['createFragranceCollectionItem'] = async (_, args, context, info) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to sign up or log in before adding an item to a collection',
        403
      )
    }

    const { fragranceId, collectionId } = input

    return await services
      .fragrance
      .collections
      .findOne(
        eb => eb('id', '=', collectionId)
      )
      .andThen(row => {
        if (row.userId !== me.id) {
          return errAsync(
            new ApiError(
              'NOT_AUTHORIZED',
              'You are not authorized to perform this action',
              403,
              'User attempted to add an item to another users collection'
            )
          )
        }

        return okAsync(row)
      })
      .andThen(() => services
        .fragrance
        .collections
        .items
        .create({ fragranceId, collectionId })
      )
      .match(
        mapCollectionItemRowToCollectionItemSummary,
        throwError
      )
  }

  moveCollectionItem: MutationResolvers['moveFragranceCollectionItem'] = async (_, args, context, info) => {
    const { input } = args
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You need to sign up or log in before moving items in a collection',
        403
      )
    }

    parseSchema(MoveFragranceCollectionItemInputSchema, input)

    const { collectionId, insertBefore, rangeStart, rangeLength } = input

    return await services
      .fragrance
      .collections
      .findOne(
        eb => eb('fragranceCollections.id', '=', collectionId)
      )
      .andThen(collection => {
        if (collection.userId !== me.id) {
          return errAsync(
            new ApiError(
              'NOT_AUTHORIZED',
              'You are not authorized to perform this action',
              403,
              'User tried modifying another users collection'
            )
          )
        }

        return okAsync(collection)
      })
      .andThen(() => services
        .fragrance
        .collections
        .items
        .move(
          collectionId,
          {
            before: insertBefore,
            start: rangeStart,
            length: rangeLength ?? 1
          }
        )
      )
      .match(
        rows => rows.map(mapCollectionItemRowToCollectionItemSummary),
        throwError
      )
  }

  deleteCollectionItem: MutationResolvers['deleteFragranceCollectionItem'] = async (_, args, context, info) => {
    const { input } = args
    const { collectionId, fragranceId } = input
    const { me, services } = context

    if (me == null) {
      throw new ApiError(
        'NOT_AUTHORIZED',
        'You are not authorized to perform this action',
        403
      )
    }

    return await services
      .fragrance
      .collections
      .findOne(
        eb => eb('id', '=', collectionId)
      )
      .andThen(row => {
        if (row.userId !== me.id) {
          return errAsync(
            new ApiError(
              'NOT_AUTHORIZED',
              'You are not authorized to perform this action',
              403,
              'User tried modifying another users collection (item)'
            )
          )
        }

        return okAsync(row)
      })
      .andThen(() => services
        .fragrance
        .collections
        .items
        .softDelete(
          eb => eb
            .and([
              eb('collectionId', '=', collectionId),
              eb('fragranceId', '=', fragranceId)
            ])
        )
      )
      .match(
        rows => rows.map(mapCollectionItemRowToCollectionItemSummary),
        throwError
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

export const MoveFragranceCollectionItemInputSchema = z
  .object({
    insertBefore: z
      .number()
      .nonnegative(),
    rangeStart: z
      .number()
      .nonnegative(),
    rangeLength: z
      .number()
      .min(1, 'rangeLength must be at least 1')
      .max(20, 'rangeLength cannot exceed 20')
      .default(1)
  })
  .refine(data => data.insertBefore !== data.rangeStart, {
    message: 'insertBefore and rangeStart must not be the same',
    path: ['insertBefore']
  })
  .refine(data => (data.insertBefore < data.rangeStart) || (data.insertBefore >= data.rangeStart + data.rangeLength), {
    message: 'insertBefore cannot point inside the moved range',
    path: ['insertBefore']
  })
