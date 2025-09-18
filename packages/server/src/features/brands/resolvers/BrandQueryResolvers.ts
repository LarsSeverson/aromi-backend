import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { throwError, unwrapOrThrow } from '@aromi/shared'
import { BrandPaginationFactory } from '../factories/BrandPaginationFactory.js'
import { SearchPaginationFactory } from '@src/features/search/factories/SearchPaginationFactory.js'
import { BrandEditQueryResolvers } from './BrandEditQueryResolvers.js'

export class BrandQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly edits = new BrandEditQueryResolvers()
  private readonly pagination = new BrandPaginationFactory()
  private readonly searchPagination = new SearchPaginationFactory()

  brand: QueryResolvers['brand'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { brands } = services

    const row = await unwrapOrThrow(
      brands.findOne(eb => eb('id', '=', id))
    )

    return row
  }

  brands: QueryResolvers['brands'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.pagination.parse(input)
    const { brands } = services

    return await brands
      .paginate(pagination)
      .map(rows => this
        .pageFactory
        .paginate(rows, pagination)
      )
      .match(
        connection => connection,
        throwError
      )
  }

  searchBrands: QueryResolvers['searchBrands'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { term, pagination } = input ?? {}
    const offsetPagination = this.searchPagination.parse(pagination)

    const { search } = services

    return await search
      .brands
      .search({
        term,
        pagination: offsetPagination
      })
      .match(
        ({ hits }) => hits,
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      brand: this.brand,
      brands: this.brands,
      searchBrands: this.searchBrands,
      ...this.edits.getResolvers()
    }
  }
}
