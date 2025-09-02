import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory'
import { type QueryResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapFragranceRequestRowToFragranceRequest } from '../utils/mappers'
import { ApiError, throwError } from '@src/common/error'
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
        if (row.requestStatus === 'DRAFT') {
          if (me?.id !== row.userId) {
            return errAsync(
              new ApiError(
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
