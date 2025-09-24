import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'
import { BackendError, INVALID_ID, RequestStatus, unwrapOrThrow } from '@aromi/shared'

export class BrandRequestQueryResolvers extends BaseResolver<QueryResolvers> {
  private readonly pagination = new RequestPaginationFactory()

  brandRequest: QueryResolvers['brandRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { id } = args
    const { me, services } = context

    const { brands } = services

    const request = await unwrapOrThrow(
      brands
        .requests
        .findOne(eb => eb('id', '=', id))
    )

    if (request.requestStatus === RequestStatus.DRAFT) {
      if (me?.id !== request.userId) {
        throw new BackendError(
          'NOT_AUTHORIZED',
          'You are not authorized to view this brand request',
          403
        )
      }
    }

    return mapBrandRequestRowToBrandRequestSummary(request)
  }

  brandRequests: QueryResolvers['brandRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { me, services } = context

    const { brands } = services
    const pagination = this.pagination.parse(input)

    const rows = await unwrapOrThrow(
      brands
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
    const transformed = this.pageFactory.transform(connection, mapBrandRequestRowToBrandRequestSummary)

    return transformed
  }

  getResolvers (): QueryResolvers {
    return {
      brandRequest: this.brandRequest,
      brandRequests: this.brandRequests
    }
  }
}
