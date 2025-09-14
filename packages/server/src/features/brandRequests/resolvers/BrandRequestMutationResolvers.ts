import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapBrandRequestRowToBrandRequestSummary, mapCreateBrandRequestInputToRow } from '../utils/mappers.js'
import { BackendError, parseOrThrow, throwError, unwrapOrThrow, ValidBrand } from '@aromi/shared'
import { BrandRequestImageMutationResolvers } from './BrandRequestImageMutationResolvers.js'
import { BrandRequestVoteMutationResolvers } from './BrandRequestVoteMutationResolvers.js'
import { mapUpdateFragranceRequestInputToRow } from '@src/features/fragranceRequests/utils/mappers.js'

export class BrandRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly images = new BrandRequestImageMutationResolvers()
  private readonly votes = new BrandRequestVoteMutationResolvers()

  createBrandRequest: MutationResolvers['createBrandRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const values = mapCreateBrandRequestInputToRow(input)
    const { brandRequests } = services

    return await brandRequests
      .createOne({ ...values, userId: me.id })
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  updateBrandRequest: MutationResolvers['updateBrandRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, version } = input
    const values = mapUpdateFragranceRequestInputToRow(input)
    const { brandRequests } = services

    return await brandRequests
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('version', '=', version),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ]),
        values
      )
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  deleteBrandRequest: MutationResolvers['deleteBrandRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { brandRequests } = services

    return await brandRequests
      .softDeleteOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ])
      )
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  submitBrandRequest: MutationResolvers['submitBrandRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { brandRequests } = services

    return await brandRequests
      .withTransactionAsync(async trx => {
        await unwrapOrThrow(
          trx
            .images
            .findOne(eb => eb.and([
              eb('requestId', '=', id),
              eb('status', '=', 'ready')
            ]))
            .mapErr(error => {
              return new BackendError(
                'IMAGE_REQUIRED',
                'At least one image is required to submit a brand request',
                400,
                error
              )
            })
        )

        const request = await unwrapOrThrow(
          trx
            .updateOne(
              eb => eb.and([
                eb('id', '=', id),
                eb('userId', '=', me.id),
                eb('requestStatus', '=', 'DRAFT')
              ]),
              { requestStatus: 'PENDING' }
            )
        )

        parseOrThrow(ValidBrand, request)

        return request
      })
      .match(
        mapBrandRequestRowToBrandRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.images.getResolvers(),
      ...this.votes.getResolvers(),

      createBrandRequest: this.createBrandRequest,
      updateBrandRequest: this.updateBrandRequest,
      deleteBrandRequest: this.deleteBrandRequest,
      submitBrandRequest: this.submitBrandRequest
    }
  }
}
