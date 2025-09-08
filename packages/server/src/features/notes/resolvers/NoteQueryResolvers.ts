import { type QueryResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { NotePaginationFactory } from '../factories/NotePaginationFactory'
import { throwError } from '@aromi/shared'
import { SearchPaginationFactory } from '../../search/factories/SearchPaginationFactory'

export class NoteQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new NotePaginationFactory()
  private readonly searchPagination = new SearchPaginationFactory()

  notes: QueryResolvers['notes'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const { notes } = services

    const pagination = this.pagination.parse(input)

    return await notes
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

  searchNotes: QueryResolvers['searchNotes'] = async (
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
      .notes
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
      notes: this.notes,
      searchNotes: this.searchNotes
    }
  }
}
