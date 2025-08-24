import { type QueryResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { AccordPaginationFactory } from '../factories/AccordPaginationFactory'
import { throwError } from '@src/common/error'

export class AccordQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new AccordPaginationFactory()

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
        ({ connection }) => connection,
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      accords: this.accords
    }
  }
}
