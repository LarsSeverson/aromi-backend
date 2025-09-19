import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { NoteEditPaginationFactory } from '../factories/NoteEditPaginationFactory.js'
import { unwrapOrThrow } from '@aromi/shared'

export class NoteEditQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new NoteEditPaginationFactory()

  noteEdit: QueryResolvers['noteEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { notes } = services

    const row = await unwrapOrThrow(
      notes
        .edits
        .findOne(nb => nb('id', '=', id))
    )

    return row
  }

  noteEdits: QueryResolvers['noteEdits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.pagination.parse(input)
    const { notes } = services

    const rows = await unwrapOrThrow(
      notes
        .edits
        .paginate(pagination)
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      noteEdit: this.noteEdit,
      noteEdits: this.noteEdits
    }
  }
}