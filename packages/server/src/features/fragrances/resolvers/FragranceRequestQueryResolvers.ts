import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { BackendError, INVALID_ID, RequestStatus, unwrapOrThrow } from '@aromi/shared'

export class FragranceRequestQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new RequestPaginationFactory()

  fragranceRequest: QueryResolvers['fragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { me, services } = context

    const { fragrances } = services

    const request = await unwrapOrThrow(
      fragrances
        .requests
        .findOne(eb => eb('id', '=', id))
    )

    if (request.requestStatus === RequestStatus.DRAFT) {
      if (me?.id !== request.userId) {
        throw new BackendError(
          'NOT_AUTHORIZED',
          'You are not authorized to view this fragrance request',
          403
        )
      }
    }

    return mapFragranceRequestRowToFragranceRequest(request)
  }

  fragranceRequests: QueryResolvers['fragranceRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    const { fragrances } = services
    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(
      fragrances
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
    const transformed = this.pageFactory.transform(connection, mapFragranceRequestRowToFragranceRequest)

    return transformed
  }

  getResolvers (): QueryResolvers {
    return {
      fragranceRequest: this.fragranceRequest,
      fragranceRequests: this.fragranceRequests
    }
  }
}
