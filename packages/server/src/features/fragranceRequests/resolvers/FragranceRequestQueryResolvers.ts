import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers.js'
import { BackendError, RequestStatus, throwError } from '@aromi/shared'
import { errAsync, okAsync } from 'neverthrow'

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

    const { fragranceRequests } = services

    return await fragranceRequests
      .findOne(
        eb => eb.and([
          eb('id', '=', id)
        ])
      )
      .andThen(row => {
        if (row.requestStatus === RequestStatus.DRAFT) {
          if (me?.id !== row.userId) {
            return errAsync(
              new BackendError(
                'NOT_AUTHORIZED',
                'You are not authorized to view this fragrance request',
                403
              )
            )
          }
        }

        return okAsync(row)
      })
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  fragranceRequests: QueryResolvers['fragranceRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { fragranceRequests } = services
    const pagination = this.pagination.parse(input)

    return await fragranceRequests
      .find(
        eb => eb.and([
          eb('requestStatus', '!=', RequestStatus.DRAFT)
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
          .transform(connection, mapFragranceRequestRowToFragranceRequest),
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      fragranceRequest: this.fragranceRequest,
      fragranceRequests: this.fragranceRequests
    }
  }
}
