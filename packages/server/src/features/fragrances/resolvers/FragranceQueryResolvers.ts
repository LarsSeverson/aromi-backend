import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'
import { FragrancePaginationFactory } from '../factories/FragrancePaginationFactory.js'

export class FragracneQueryResolvers extends BaseResolver<QueryResolvers> {
  pagination = new FragrancePaginationFactory()

  fragrance: QueryResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { fragrances } = services

    const fragrance = await unwrapOrThrow(
      fragrances
        .findOne(
          eb => eb('id', '=', id)
        )
    )

    return mapFragranceRowToFragranceSummary(fragrance)
  }

  fragrances: QueryResolvers['fragrances'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { fragrances } = services
    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(fragrances.paginate(pagination))

    const connection = this.pageFactory.paginate(rows, pagination)
    const summaryConnection = this.pageFactory.transform(connection, mapFragranceRowToFragranceSummary)

    return summaryConnection
  }

  getResolvers (): QueryResolvers {
    return {
      fragrance: this.fragrance,
      fragrances: this.fragrances
    }
  }
}