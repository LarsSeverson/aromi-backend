import { unwrapOrThrow } from '@aromi/shared'
import { FragrancePaginationFactory } from '@src/features/fragrances/factories/FragrancePaginationFactory.js'
import { mapFragranceRowToFragranceSummary } from '@src/features/fragrances/utils/mappers.js'
import type { BrandResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class BrandFieldResolvers extends BaseResolver<BrandResolvers> {
  private readonly fPagination = new FragrancePaginationFactory()

  fragrances: BrandResolvers['fragrances'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const pagination = this.fPagination.parse(input)
    const { fragrances } = services

    const rows = await unwrapOrThrow(
      fragrances
        .find(
          eb => eb('brandId', '=', id),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(rows, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceRowToFragranceSummary)

    return transformed
  }

  getResolvers (): BrandResolvers {
    return {
      fragrances: this.fragrances
    }
  }
}