import { ApiError, throwError } from '@src/common/error'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory'
import { type QueryResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapNoteRequestRowToNoteRequestSummary } from '../utils/mappers'
import { errAsync, okAsync } from 'neverthrow'

export class NoteRequestQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new RequestPaginationFactory()

  noteRequest: QueryResolvers['noteRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { me, services } = context

    const { noteRequests } = services

    return await noteRequests
      .findOne(
        eb => eb.and([
          eb('id', '=', id)
        ])
      )
      .andThen(row => {
        if (row.requestStatus === 'DRAFT') {
          if (me?.id !== row.userId) {
            return errAsync(
              new ApiError(
                'NOT_AUTHORIZED',
                'You are not authorized to view this note request',
                403
              )
            )
          }
        }

        return okAsync(row)
      })
      .match(
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  noteRequests: QueryResolvers['noteRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { noteRequests } = services
    const pagination = this.pagination.parse(input)

    return await noteRequests
      .find(
        eb => eb.and([
          eb('requestStatus', '!=', 'DRAFT')
        ]),
        { pagination }
      )
      .map(rows => this
        .pageFactory
        .paginate(rows, pagination)
      )
      .match(
        connection => this
          .pageFactory
          .transform(connection, mapNoteRequestRowToNoteRequestSummary),
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      noteRequest: this.noteRequest,
      noteRequests: this.noteRequests
    }
  }
}
