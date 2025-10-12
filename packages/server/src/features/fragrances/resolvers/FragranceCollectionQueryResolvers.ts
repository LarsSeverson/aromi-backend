import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceCollectionPaginationFactory } from '../factories/FragranceCollectionPaginationFactory.js'

export class FragranceCollectionQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly collectionPagination = new FragranceCollectionPaginationFactory()

  collection: QueryResolvers['fragranceCollection'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { fragrances } = services

    const row = await unwrapOrThrow(
      fragrances.collections.findOne(eb => eb('id', '=', id))
    )

    return row
  }

  collections: QueryResolvers['fragranceCollections'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { fragrances } = services

    const pagination = this.collectionPagination.parse(input)

    const rows = await unwrapOrThrow(fragrances.collections.paginate(pagination))

    return this.pageFactory.paginate(rows, pagination)
  }

  getResolvers (): QueryResolvers {
    return {
      fragranceCollection: this.collection,
      fragranceCollections: this.collections
    }
  }
}