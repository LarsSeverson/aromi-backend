import { ApiError, throwError } from '@aromi/shared'
import type { QueryResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapAccordRequestRowToAccordRequestSummary } from '../utils/mappers.js'
import { errAsync, okAsync } from 'neverthrow'
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

    const { accordRequests } = services

    return await accordRequests
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
                'You are not authorized to view this accord request',
                403
              )
            )
          }
        }

        return okAsync(row)
      })
      .match(
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  accordRequests: QueryResolvers['accordRequests'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context

    const { accordRequests } = services
    const pagination = this.pagination.parse(input)

    return await accordRequests
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
          .transform(connection, mapAccordRequestRowToAccordRequestSummary),
        throwError
      )
  }

  getResolvers (): QueryResolvers {
    return {
      accordRequest: this.accordRequest,
      accordRequests: this.accordRequests
    }
  }
}
