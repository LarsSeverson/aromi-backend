import { BackendError, type FragranceCollectionRow, type FragranceCollectionService, unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'

type Mutation = MutationResolvers['createFragranceCollectionItem']

export class CreateFragranceCollectionItemResolver extends MutationResolver<Mutation> {
  private trxService?: FragranceCollectionService
  private static readonly DEFAULT_GAP = 1000
  private static readonly DEFAULT_RANK = 1000

  async resolve () {
    const { context } = this
    const { services } = context

    const { collections } = services.users

    const item = await unwrapOrThrow(
      collections.withTransactionAsync(async trx => {
        this.trxService = trx
        return await this.createItem()
      })
    )

    return item
  }

  async createItem () {
    const collection = await unwrapOrThrow(this.getCollection())
    this.checkAuthorized(collection)

    const topItem = await this.getTopItem()

    const rank = topItem.isErr()
      ? CreateFragranceCollectionItemResolver.DEFAULT_RANK
      : topItem.value.rank + CreateFragranceCollectionItemResolver.DEFAULT_GAP

    const newItem = await unwrapOrThrow(this.createNewItem(rank))

    await unwrapOrThrow(this.updateCollection())

    return newItem
  }

  private createNewItem (rank: number) {
    const { args } = this
    const { collectionId, fragranceId } = args.input

    return this.trxService!.items.createOne({
      collectionId,
      fragranceId,
      rank
    })
  }

  private updateCollection () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.updateOne(
      where => where('id', '=', collectionId),
      { updatedAt: new Date().toISOString() }
    )
  }

  private getCollection () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.findOne(where => where('id', '=', collectionId))
  }

  private getTopItem () {
    const { args } = this
    const { collectionId } = args.input

    return this.trxService!.items.findOne(
      where => where('collectionId', '=', collectionId),
      qb => qb.orderBy('rank', 'desc')
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