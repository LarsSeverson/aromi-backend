import { type QueryResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { NotePaginationFactory } from '../factories/NotePaginationFactory'
import { throwError } from '@src/common/error'

export class NoteQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new NotePaginationFactory()

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

  getResolvers (): QueryResolvers {
    return {
      notes: this.notes
    }
  }
}
