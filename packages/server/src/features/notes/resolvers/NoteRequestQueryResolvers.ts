import { BackendError, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapNoteRequestRowToNoteRequestSummary } from '../../notes/utils/mappers.js'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'

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

    const { notes } = services

    const request = await unwrapOrThrow(
      notes
        .requests
        .findOne(eb => eb('id', '=', id))
    )

    if (request.requestStatus === RequestStatus.DRAFT) {
      if (me?.id !== request.userId) {
        throw new BackendError(
          'NOT_AUTHORIZED',
          'You are not authorized to view this note request',
          403
        )
      }
    }

    return mapNoteRequestRowToNoteRequestSummary(request)
  }

  noteRequests: QueryResolvers['noteRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    const { notes } = services
    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(
      notes
        .requests
        .find(
          eb => eb
            .or([
              eb('requestStatus', '!=', RequestStatus.DRAFT),
              eb
                .and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? '')
                ])
            ]),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(rows, pagination)
    const transformed = this.pageFactory.transform(connection, mapNoteRequestRowToNoteRequestSummary)

    return transformed
  }

  getResolvers (): QueryResolvers {
    return {
      noteRequest: this.noteRequest,
      noteRequests: this.noteRequests
    }
  }
}
