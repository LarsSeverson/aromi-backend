import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { parseOrThrow, throwError, unwrapOrThrow } from '@aromi/shared'
import { NotePaginationFactory } from '../factories/NotePaginationFactory.js'
import { NoteEditQueryResolvers } from './NoteEditQueryResolvers.js'
import { NoteRequestQueryResolvers } from './NoteRequestQueryResolvers.js'
import { SearchInputSchema } from '@src/features/search/utils/validation.js'

export class NoteQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly edits = new NoteEditQueryResolvers()
  private readonly requests = new NoteRequestQueryResolvers()

  private readonly pagination = new NotePaginationFactory()

  note: QueryResolvers['note'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { notes } = services

    const note = await unwrapOrThrow(
      notes
        .findOne(eb => eb('id', '=', id))
    )

    return note
  }

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

    const { term } = parseOrThrow(SearchInputSchema, input)
    const { pagination } = input ?? {}
    const offsetPagination = this.searchPagination.parse(pagination)

    const { search } = services

    const { hits } = await unwrapOrThrow(
      search
        .notes
        .search({
          term,
          pagination: offsetPagination
        })
    )

    const connection = this.searchPageFactory.paginate(hits, offsetPagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      note: this.note,
      notes: this.notes,
      searchNotes: this.searchNotes,
      ...this.edits.getResolvers(),
      ...this.requests.getResolvers()
    }
  }
}
