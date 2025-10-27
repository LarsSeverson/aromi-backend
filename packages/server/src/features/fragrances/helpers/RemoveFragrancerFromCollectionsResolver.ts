import { BackendError, type FragranceCollectionItemRow, unwrapOrThrow, type FragranceCollectionRow, type FragranceCollectionService } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'

type Mutation = MutationResolvers['removeFragranceFromCollections']

export class RemoveFragranceFromCollectionsResolver extends MutationResolver<Mutation> {
  private trxService?: FragranceCollectionService

  async resolve () {
    const { context } = this
    const { services } = context
    const { collections } = services.users

    const deletedItems = await unwrapOrThrow(
      collections.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.removeItems()
      })
    )

    return deletedItems
  }

  private async removeItems () {
    const { args } = this
    const { fragranceId, collectionIds } = args.input

    const results: FragranceCollectionItemRow[] = []

    for (const collectionId of collectionIds) {
      const collection = await unwrapOrThrow(this.getCollection(collectionId))
      this.checkAuthorized(collection)

      const item = await this.trxService!.items.findOne(
        where =>
          where('collectionId', '=', collectionId).and('fragranceId', '=', fragranceId)
      )

      if (item.isErr()) continue

      const deleted = await unwrapOrThrow(
        this.trxService!.items.softDeleteOne(where => where('id', '=', item.value.id))
      )

      await unwrapOrThrow(this.updateCollection(collectionId))
      results.push(deleted)
    }

    return results
  }

  private getCollection (collectionId: string) {
    return this.trxService!.findOne(where => where('id', '=', collectionId))
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
      throw new BackendError('NOT_AUTHORIZED', 'You are not authorized to modify this collection.', 403)
    }
  }
}