import { type QueryResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { throwError } from '@aromi/shared'
import { SearchPaginationFactory } from '../../search/factories/SearchPaginationFactory'
import { BrandPaginationFactory } from '../factories/BrandPaginationFactory'

export class BrandQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new BrandPaginationFactory()
  private readonly searchPagination = new SearchPaginationFactory()

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
      brands: this.brands,
      searchBrands: this.searchBrands
    }
  }
}
