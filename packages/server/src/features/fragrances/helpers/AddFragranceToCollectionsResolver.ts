import { BackendError, type FragranceCollectionItemRow, unwrapOrThrow, type FragranceCollectionRow, type FragranceCollectionService } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'

type Mutation = MutationResolvers['addFragranceToCollections']

export class AddFragranceToCollectionsResolver extends MutationResolver<Mutation> {
  private trxService?: FragranceCollectionService
  private static readonly DEFAULT_GAP = 1000
  private static readonly DEFAULT_RANK = 1000

  async resolve () {
    const { context } = this
    const { services } = context

    const { collections } = services.users

    const items = await unwrapOrThrow(
      collections.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.createItems()
      })
    )

    return items
  }

  private async createItems () {
    const { args } = this
    const { fragranceId, collectionIds } = args.input

    const results: FragranceCollectionItemRow[] = []

    for (const collectionId of collectionIds) {
      const collection = await unwrapOrThrow(this.getCollection(collectionId))
      this.checkAuthorized(collection)

      const topItem = await this.getTopItem(collectionId)
      const rank = topItem.isErr()
        ? AddFragranceToCollectionsResolver.DEFAULT_RANK
        : topItem.value.rank + AddFragranceToCollectionsResolver.DEFAULT_GAP

      const newItem = await unwrapOrThrow(
        this.trxService!.items.createOne({
          collectionId,
          fragranceId,
          rank
        })
      )

      await unwrapOrThrow(this.updateCollection(collectionId))
      results.push(newItem)
    }

    return results
  }

  private getCollection (collectionId: string) {
    return this.trxService!.findOne(where => where('id', '=', collectionId))
  }

  private getTopItem (collectionId: string) {
    return this.trxService!.items.findOne(
      where => where('collectionId', '=', collectionId),
      qb => qb.orderBy('rank', 'desc')
    )
  }

  private updateCollection (collectionId: string) {
    return this.trxService!.updateOne(
      where => where('id', '=', collectionId),
      { updatedAt: new Date().toISOString() }
    )
  }

  private checkAuthorized (collection: FragranceCollectionRow) {
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