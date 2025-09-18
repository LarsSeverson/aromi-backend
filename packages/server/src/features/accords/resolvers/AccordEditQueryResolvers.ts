import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { AccordEditPaginationFactory } from '../factories/AccordEditPaginationFactory.js'
import { unwrapOrThrow } from '@aromi/shared'

export class AccordEditQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new AccordEditPaginationFactory()

  accordEdit: QueryResolvers['accordEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context
    const { accords } = services

    const row = await unwrapOrThrow(
      accords
        .edits
        .findOne(eb => eb('id', '=', id))
    )

    return row
  }

  accordEdits: QueryResolvers['accordEdits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.pagination.parse(input)
    const { accords } = services

    const rows = await unwrapOrThrow(
      accords
        .edits
        .paginate(pagination)
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      accordEdit: this.accordEdit,
      accordEdits: this.accordEdits
    }
  }
}