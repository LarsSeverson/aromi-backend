import { throwError } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from './utils/mappers.js'
import { FragrancePaginationFactory } from './factories/FragrancePaginationFactory.js'

export class FragranceQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new FragrancePaginationFactory()

  fragrance: QueryResolvers['fragrance'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { fragrances } = services

    return await fragrances
      .findOne(
        eb => eb('id', '=', id)
      )
      .match(
        mapFragranceRowToFragranceSummary,
        throwError
      )
  }

  fragrances: QueryResolvers['fragrances'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.pagination.parse(input)
    const { fragrances } = services

    return await fragrances
      .paginate(pagination)
      .map(rows => this
        .pageFactory
        .paginate(rows, pagination)
      )
      .match(
        connection => this
          .pageFactory
          .transform(connection, mapFragranceRowToFragranceSummary),
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      fragrance: this.fragrance,
      fragrances: this.fragrances
    }
  }
}