import { BackendError, type FragranceCollectionRow, parseOrThrow, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'
import type { MoveFragranceCollectionsInputType } from '../types.js'
import { MoveFragranceCollectionsInputSchema } from '../utils/validation.js'

type Mutation = MutationResolvers['moveFragranceCollections']

export class MoveFragranceCollectionsResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices

  private static readonly DEFAULT_GAP = 1000
  private static readonly DEFAULT_RANK = 1000
  private static readonly RANK_EPSILON = 0.0001

  async resolve () {
    const { context } = this
    const { services } = context

    const collections = await services.withTransaction(async trx => {
      this.trxServices = trx
      return await this.moveCollections()
    })

    return collections
  }

  async moveCollections () {
    const { args } = this

    const parsedInput = parseOrThrow(MoveFragranceCollectionsInputSchema, args.input)

    const collections = await unwrapOrThrow(this.getCollections())

    if (collections.length === 0) {
      throw new BackendError(
        'NO_ITEMS',
        'There are no collections to move.',
        400
      )
    }

    const { startIndex, moving, remaining } = this.getSplitRange(collections, parsedInput)
    const insertIndex = this.getInsertIndex(collections, parsedInput, startIndex)
    const { before, after } = this.getNeighbors(remaining, insertIndex)
    const baseRank = this.getBaseRank(before, after)

    const updated = await this.updateRanks(moving, baseRank)

    return updated
  }

  private getCollections () {
    const { me } = this
    const userId = me.id

    const collections = this.trxServices!.fragrances.collections

    return collections.find(
      where => where('userId', '=', userId),
      qb => qb.orderBy('rank', 'desc')
    )
  }

  private async updateRanks (moving: FragranceCollectionRow[], baseRank: number) {
    const { trxServices } = this
    const collections = trxServices!.fragrances.collections

    const ops = moving.map(
      async (collection, index) =>
        await unwrapOrThrow(
          collections.updateOne(
            where => where('id', '=', collection.id),
            { rank: baseRank + index * MoveFragranceCollectionsResolver.RANK_EPSILON }
          )
        )
    )

    return await Promise.all(ops)
  }

  private getSplitRange (collections: FragranceCollectionRow[], input: MoveFragranceCollectionsInputType) {
    const { rangeStart, rangeLength } = input

    const startIndex = collections.findIndex(i => i.id === rangeStart)
    if (startIndex === -1) {
      throw new BackendError(
        'INVALID_RANGE_START',
        'The rangeStart collection does not exist.',
        400
      )
    }

    const moving = collections.slice(startIndex, startIndex + rangeLength)
    const remaining = collections.filter(i => !moving.includes(i))

    return { startIndex, moving, remaining }
  }

  private getInsertIndex (
    collections: FragranceCollectionRow[],
    input: MoveFragranceCollectionsInputType,
    startIndex: number
  ) {
    const { insertBefore, rangeLength } = input

    const rawIndex = insertBefore == null
      ? collections.length
      : collections.findIndex(i => i.id === insertBefore)

    if (rawIndex === -1) {
      throw new BackendError(
        'INVALID_INSERT_BEFORE',
        'The insertBefore collection does not exist.',
        400
      )
    }

    return rawIndex > startIndex ? rawIndex - rangeLength : rawIndex
  }

  private getNeighbors (collectinos: FragranceCollectionRow[], insertIndex: number) {
    const before = insertIndex > 0 ? collectinos.at(insertIndex - 1) : undefined
    const after = insertIndex < collectinos.length ? collectinos.at(insertIndex) : undefined

    return { before, after }
  }

  private getBaseRank (before: FragranceCollectionRow | undefined, after: FragranceCollectionRow | undefined) {
    const gap = MoveFragranceCollectionsResolver.DEFAULT_GAP

    if (before != null && after != null) return (before.rank + after.rank) / 2
    if (before != null && after == null) return before.rank - gap
    if (before == null && after != null) return after.rank + gap

    return MoveFragranceCollectionsResolver.DEFAULT_RANK
  }
}