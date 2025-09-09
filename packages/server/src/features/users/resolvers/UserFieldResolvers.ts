import { throwError } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import type { UserResolvers } from '@src/graphql/gql-types.js'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import { mapFragranceRequestRowToFragranceRequest } from '@src/features/fragranceRequests/utils/mappers.js'
import { mapBrandRequestRowToBrandRequestSummary } from '@src/features/brandRequests/utils/mappers.js'

export class UserFieldResolvers extends BaseResolver<UserResolvers> {
  private readonly requestPagination = new RequestPaginationFactory()

  fragranceRequests: UserResolvers['fragranceRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { fragranceRequests } = services
    const pagination = this.requestPagination.parse(input)

    return await fragranceRequests
      .find(
        eb => {
          if (me?.id !== id) {
            return eb.and([
              eb('userId', '=', id),
              eb('requestStatus', '!=', 'DRAFT')
            ])
          }

          return eb.and([
            eb('userId', '=', id)
          ])
        },
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

  brandRequests: UserResolvers['brandRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { brandRequests } = services
    const pagination = this.requestPagination.parse(input)

    return await brandRequests
      .find(
        eb => {
          if (me?.id !== id) {
            return eb.and([
              eb('userId', '=', id),
              eb('requestStatus', '!=', 'DRAFT')
            ])
          }

          return eb.and([
            eb('userId', '=', id)
          ])
        },
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

  getResolvers (): UserResolvers {
    return {
      fragranceRequests: this.fragranceRequests,
      brandRequests: this.brandRequests
    }
  }
}
