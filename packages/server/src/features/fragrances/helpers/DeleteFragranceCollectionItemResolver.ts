import { BackendError, type FragranceCollectionRow, type FragranceCollectionService, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'

type Mutation = MutationResolvers['deleteFragranceCollectionItem']

export class DeleteFragranceCollectionItemResolver extends MutationResolver<Mutation> {
  private trxService?: FragranceCollectionService

  async resolve () {
    const { context } = this
    const { services } = context

    const { collections } = services.users

    const item = await unwrapOrThrow(
      collections.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.removeItem()
      })
    )

    return item
  }

  private async removeItem () {
    const collection = await unwrapOrThrow(this.getCollection())
    this.checkAuthorized(collection)

    const deleted = await unwrapOrThrow(this.deleteItem())

    await unwrapOrThrow(this.updateCollection())

    return deleted
  }

  private deleteItem () {
    const { args } = this
    const { itemId } = args.input

    return this.trxService!.items.softDeleteOne(where => where('id', '=', itemId))
  }

  private getCollection () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.findOne(where => where('id', '=', collectionId))
  }

  private updateCollection () {
    const { args } = this
    const { collectionId } = args.input

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