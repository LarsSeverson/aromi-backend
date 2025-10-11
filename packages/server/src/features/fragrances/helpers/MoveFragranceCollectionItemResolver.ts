import { BackendError, type FragranceCollectionItemRow, type FragranceCollectionRow, type FragranceCollectionService, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import { MoveFragranceCollectionItemInputSchema } from '../utils/validation.js'
import type z from 'zod'

type Mutation = MutationResolvers['moveFragranceCollectionItems']

export class MoveFragranceCollectionItemsResolver extends MutationResolver<Mutation> {
  private trxService?: FragranceCollectionService
  private static readonly DEFAULT_GAP = 1000
  private static readonly DEFAULT_RANK = 1000
  private static readonly RANK_EPSILON = 0.0001

  async resolve () {
    const { context } = this
    const { services } = context

    const { collections } = services.users

    const items = await unwrapOrThrow(
      collections.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.moveItems()
      })
    )

    return items
  }

  async moveItems () {
    const { args } = this

    const parsedInput = parseOrThrow(MoveFragranceCollectionItemInputSchema, args.input)

    const collection = await unwrapOrThrow(this.getCollection())
    this.checkAuthorized(collection)

    const items = await unwrapOrThrow(this.getItems())

    if (items.length === 0) {
      throw new BackendError(
        'NO_ITEMS',
        'This collection has no items to move.',
        400
      )
    }

    const { moving, remaining } = this.getSplitRange(items, parsedInput)
    const insertIndex = this.getInsertIndex(remaining, parsedInput)
    const { before, after } = this.getNeighbors(remaining, insertIndex)
    const baseRank = this.getBaseRank(before, after)

    const updated = await this.updateRanks(moving, baseRank)

    await unwrapOrThrow(this.updateCollection())

    return updated
  }

  private getCollection () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.findOne(where => where('id', '=', collectionId))
  }

  private getItems () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.items.find(where => where('collectionId', '=', collectionId))
  }

  private async updateRanks (moving: FragranceCollectionItemRow[], baseRank: number) {
    const ops = moving.map(
      async (item, index) =>
        await unwrapOrThrow(
          this.trxService!.items.updateOne(
            where => where('id', '=', item.id),
            { rank: baseRank + index * MoveFragranceCollectionItemsResolver.RANK_EPSILON }
          )
        )
    )

    return await Promise.all(ops)
  }

  private updateCollection () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.updateOne(
      where => where('id', '=', collectionId),
      { updatedAt: new Date().toISOString() }
    )
  }

  private getSplitRange (items: FragranceCollectionItemRow[], input: z.infer<typeof MoveFragranceCollectionItemInputSchema>) {
    const { rangeStart, rangeLength } = input

    const startIndex = items.findIndex(i => i.id === rangeStart)
    if (startIndex === -1) {
      throw new BackendError(
        'INVALID_RANGE_START',
        'The rangeStart item does not exist in this collection.',
        400
      )
    }

    const moving = items.slice(startIndex, startIndex + rangeLength)
    const remaining = items.filter(i => !moving.includes(i))

    return { moving, remaining }
  }

  private getInsertIndex (items: FragranceCollectionItemRow[], input: z.infer<typeof MoveFragranceCollectionItemInputSchema>) {
    const { insertBefore } = input

    if (insertBefore == null) {
      return items.length
    }

    const insertIndex = items.findIndex(i => i.id === insertBefore)

    if (insertIndex === -1) {
      throw new BackendError(
        'INVALID_INSERT_BEFORE',
        'The insertBefore item does not exist in this collection.',
        400
      )
    }

    return insertIndex
  }

  private getNeighbors (items: FragranceCollectionItemRow[], insertIndex: number) {
    const before = items.at(insertIndex - 1)
    const after = items.at(insertIndex)

    return { before, after }
  }

  private getBaseRank (before: FragranceCollectionItemRow | undefined, after: FragranceCollectionItemRow | undefined) {
    if (before != null && after != null) return (before.rank + after.rank) / 2
    if (before != null && after == null) return before.rank + MoveFragranceCollectionItemsResolver.DEFAULT_GAP
    if (before == null && after != null) return after.rank - MoveFragranceCollectionItemsResolver.DEFAULT_GAP
    return MoveFragranceCollectionItemsResolver.DEFAULT_RANK
  }

  checkAuthorized (collection: FragranceCollectionRow) {
    const { me } = this

    if (collection.userId !== me.id) {
      throw new BackendError(
        'NOT_AUTHORIZED',
        'You are not authorized to modify this collection.',
        403
      )
    }
  }
}