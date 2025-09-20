import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRowToFragranceSummary } from '../utils/mappers.js'
import { FragrancePaginationFactory } from '../factories/FragrancePaginationFactory.js'
import { SearchPaginationFactory } from '@src/features/search/factories/SearchPaginationFactory.js'
import { FragranceEditQueryResolvers } from './FragranceEditQueryResolvers.js'
import { FragranceRequestQueryResolvers } from './FragranceRequestQueryResolvers.js'

export class FragranceQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly edits = new FragranceEditQueryResolvers()
  private readonly requests = new FragranceRequestQueryResolvers()

  private readonly pagination = new FragrancePaginationFactory()
  private readonly searchPagination = new SearchPaginationFactory()

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

  searchFragrances: QueryResolvers['searchFragrances'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { term, pagination } = input ?? {}
    const offsetPagination = this.searchPagination.parse(pagination)
    const { search } = services

    const { hits } = await unwrapOrThrow(
      search
        .fragrances
        .search({
          term,
          pagination: offsetPagination
        })
    )

    return hits.map(mapFragranceRowToFragranceSummary)
  }

  getResolvers (): QueryResolvers {
    return {
      fragrance: this.fragrance,
      fragrances: this.fragrances,
      searchFragrances: this.searchFragrances,
      ...this.edits.getResolvers(),
      ...this.requests.getResolvers()
    }
  }
}