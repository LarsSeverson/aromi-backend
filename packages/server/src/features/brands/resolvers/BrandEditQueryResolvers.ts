import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { BrandEditPaginationFactory } from '../factories/BrandEditPaginationFactory.js'

export class BrandEditQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new BrandEditPaginationFactory()

  brandEdit: QueryResolvers['brandEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { brands } = services

    const row = await unwrapOrThrow(
      brands
        .edits
        .findOne(eb => eb('id', '=', id))
    )

    return row
  }

  brandEdits: QueryResolvers['brandEdits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.pagination.parse(input)
    const { brands } = services

    const rows = await unwrapOrThrow(
      brands
        .edits
        .paginate(pagination)
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      brandEdit: this.brandEdit,
      brandEdits: this.brandEdits
    }
  }
}