import { BackendError, INVALID_ID, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'

export class AccordRequestQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new RequestPaginationFactory()

  accordRequest: QueryResolvers['accordRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { me, services } = context

    const { accords } = services

    const request = await unwrapOrThrow(
      accords
        .requests
        .findOne(eb => eb('id', '=', id))
    )

    if (request.requestStatus === RequestStatus.DRAFT) {
      if (me?.id !== request.userId) {
        throw new BackendError(
          'NOT_AUTHORIZED',
          'You are not authorized to view this accord request',
          403
        )
      }
    }

    return mapAccordRequestRowToAccordRequestSummary(request)
  }

  accordRequests: QueryResolvers['accordRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    const { accords } = services
    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(
      accords
        .requests
        .find(
          eb => eb
            .or([
              eb('requestStatus', '!=', RequestStatus.DRAFT),
              eb
                .and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
            ]),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(rows, pagination)
    const transformed = this.pageFactory.transform(connection, mapAccordRequestRowToAccordRequestSummary)

    return transformed
  }

  getResolvers (): QueryResolvers {
    return {
      accordRequest: this.accordRequest,
      accordRequests: this.accordRequests
    }
  }
}
