import { type QueryResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { AccordPaginationFactory } from '../factories/AccordPaginationFactory'
import { throwError } from '@aromi/shared'
import { SearchPaginationFactory } from '../../search/factories/SearchPaginationFactory'

export class AccordQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new AccordPaginationFactory()
  private readonly searchPagination = new SearchPaginationFactory()

  accords: QueryResolvers['accords'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const { accords } = services

    const pagination = this.pagination.parse(input)

    return await accords
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

  searchAccords: QueryResolvers['searchAccords'] = async (
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
      .accords
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
      accords: this.accords,
      searchAccords: this.searchAccords
    }
  }
}
