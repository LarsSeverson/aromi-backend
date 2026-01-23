import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { MutationResolver } from '@src/resolvers/MutationResolver.js'
import type { ServerServices } from '@src/services/ServerServices.js'

type Mutation = MutationResolvers['createFragranceCollection']

export class CreateFragranceCollectionResolver extends MutationResolver<Mutation> {
  private trxServices?: ServerServices
  private static readonly DEFAULT_GAP = 1000
  private static readonly DEFAULT_RANK = 1000

  async resolve () {
    const { context } = this
    const { services } = context

    const collection = await services.withTransaction(async trx => {
      this.trxServices = trx
      return await this.createCollection()
    })

    return collection
  }

  async createCollection () {
    const topCollection = await this.getTopCollection()

    const tank = topCollection.isErr()
      ? CreateFragranceCollectionResolver.DEFAULT_RANK
      : topCollection.value.rank + CreateFragranceCollectionResolver.DEFAULT_GAP

    return await unwrapOrThrow(this.createNewCollection(tank))
  }

  private createNewCollection (rank: number) {
    const { me, args } = this

    const { name } = args.input
    const userId = me.id

    const collections = this.trxServices!.fragrances.collections

    return collections.createOne({
      userId,
      rank,
      name
    })
  }

  private getTopCollection () {
    const { me } = this
    const userId = me.id

    const collections = this.trxServices!.fragrances.collections

    return collections.findOne(
      where => where('userId', '=', userId),
      qb => qb.orderBy('rank', 'desc')
    )
  }
}