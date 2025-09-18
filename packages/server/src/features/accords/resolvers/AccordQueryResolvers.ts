import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { throwError } from '@aromi/shared'
import { AccordPaginationFactory } from '../factories/AccordPaginationFactory.js'
import { SearchPaginationFactory } from '@src/features/search/factories/SearchPaginationFactory.js'
import { AccordEditQueryResolvers } from './AccordEditQueryResolvers.js'

export class AccordQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly edits = new AccordEditQueryResolvers()
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
      searchAccords: this.searchAccords,
      ...this.edits.getResolvers()
    }
  }
}
