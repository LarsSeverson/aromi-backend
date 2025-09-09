import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapBrandRequestRowToBrandRequestSummary } from '../utils/mappers.js'
import { ApiError, throwError } from '@aromi/shared'
import { errAsync, okAsync } from 'neverthrow'

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

    const { brandRequests } = services

    return await brandRequests
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
                'You are not authorized to view this brand request',
                403
              )
            )
          }
        }

        return okAsync(row)
      })
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  brandRequests: QueryResolvers['brandRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { brandRequests } = services
    const pagination = this.pagination.parse(input)

    return await brandRequests
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
          .transform(connection, mapBrandRequestRowToBrandRequestSummary),
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      brandRequest: this.brandRequest,
      brandRequests: this.brandRequests
    }
  }
}
