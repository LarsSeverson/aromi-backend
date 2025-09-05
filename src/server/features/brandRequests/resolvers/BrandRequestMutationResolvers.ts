import { type MutationResolvers } from '@generated/gql-types'
import { BaseResolver } from '@src/server/resolvers/BaseResolver'
import { mapBrandRequestRowToBrandRequestSummary, mapCreateBrandRequestInputToRow } from '../utils/mappers'
import { throwError } from '@src/utils/error'
import { mapUpdateFragranceRequestInputToRow } from '@src/server/features/fragranceRequests/utils/mappers'
import { BrandRequestImageMutationResolvers } from './BrandRequestImageMutationResolvers'
import { BrandRequestVoteMutationResolvers } from './BrandRequestVoteMutationResolvers'

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
      .create({ ...values, userId: me.id })
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
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', '=', 'DRAFT')
        ]),
        { requestStatus: 'PENDING' }
      )
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
