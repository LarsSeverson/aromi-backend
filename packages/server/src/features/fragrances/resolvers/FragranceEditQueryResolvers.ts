import { unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceEditPaginationFactory } from '../factories/FragranceEditPaginationFactory.js'

export class FragranceEditQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new FragranceEditPaginationFactory()

  fragranceEdit: QueryResolvers['fragranceEdit'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { services } = context

    const { fragrances } = services

    const row = await unwrapOrThrow(
      fragrances
        .edits
        .findOne(fb => fb('id', '=', id))
    )

    return row
  }

  fragranceEdits: QueryResolvers['fragranceEdits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const pagination = this.pagination.parse(input)
    const { fragrances } = services

    const rows = await unwrapOrThrow(
      fragrances
        .edits
        .paginate(pagination)
    )

    const connection = this.pageFactory.paginate(rows, pagination)

    return connection
  }

  getResolvers (): QueryResolvers {
    return {
      fragranceEdit: this.fragranceEdit,
      fragranceEdits: this.fragranceEdits
    }
  }
}