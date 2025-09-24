import { INVALID_ID, RequestStatus, unwrapOrThrow } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import type { UserResolvers } from '@src/graphql/gql-types.js'
import { RequestPaginationFactory } from '@src/features/requests/factories/RequestPaginationFactory.js'
import { mapFragranceRequestRowToFragranceRequest } from '@src/features/fragrances/utils/mappers.js'
import { mapBrandRequestRowToBrandRequestSummary } from '@src/features/brands/utils/mappers.js'
import { mapAccordRequestRowToAccordRequestSummary } from '@src/features/accords/utils/mappers.js'
import { mapNoteRequestRowToNoteRequestSummary } from '@src/features/notes/utils/mappers.js'

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

    const { fragrances } = services
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      fragrances
        .requests
        .find(
          eb => eb
            .and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ]),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceRequestRowToFragranceRequest)

    return transformed
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

    const { brands } = services
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      brands
        .requests
        .find(
          eb => eb
            .and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ]),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapBrandRequestRowToBrandRequestSummary)

    return transformed
  }

  accordRequests: UserResolvers['accordRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { accords } = services
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      accords
        .requests
        .find(
          eb => eb
            .and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ]),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapAccordRequestRowToAccordRequestSummary)

    return transformed
  }

  noteRequests: UserResolvers['noteRequests'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { me, services } = context

    const { notes } = services
    const pagination = this.requestPagination.parse(input)

    const requests = await unwrapOrThrow(
      notes
        .requests
        .find(
          eb => eb
            .and([
              eb('userId', '=', id),
              eb.or([
                eb('requestStatus', '!=', RequestStatus.DRAFT),
                eb.and([
                  eb('requestStatus', '=', RequestStatus.DRAFT),
                  eb('userId', '=', me?.id ?? INVALID_ID)
                ])
              ])
            ]),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(requests, pagination)
    const transformed = this.pageFactory.transform(connection, mapNoteRequestRowToNoteRequestSummary)

    return transformed
  }

  getResolvers (): UserResolvers {
    return {
      fragranceRequests: this.fragranceRequests,
      brandRequests: this.brandRequests,
      accordRequests: this.accordRequests,
      noteRequests: this.noteRequests
    }
  }
}
