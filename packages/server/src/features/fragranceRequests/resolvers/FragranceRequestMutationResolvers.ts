import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { throwError } from '@aromi/shared'
import { FragranceRequestBrandMutationResolvers } from './FragranceRequestBrandMutationResolvers.js'
import { FragranceRequestImageMutationResolvers } from './FragranceRequestImageMutationResolvers.js'
import { FragranceRequestTraitMutationResolvers } from './FragranceRequestTraitMutationResolvers.js'
import { FragranceRequestAccordMutationResolvers } from './FragranceRequestAccordMutationResolvers.js'
import { FragranceRequestNoteMutationResolvers } from './FragranceRequestNoteMutationResolvers.js'
import { FragranceRequestVoteMutationResolvers } from './FragranceRequestVoteMutationResolvers.js'
import { mapCreateFragranceRequestInputToRow, mapFragranceRequestRowToFragranceRequest, mapUpdateFragranceRequestInputToRow } from '../utils/mappers.js'

export class FragranceRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly brands = new FragranceRequestBrandMutationResolvers()
  private readonly images = new FragranceRequestImageMutationResolvers()
  private readonly traits = new FragranceRequestTraitMutationResolvers()
  private readonly accords = new FragranceRequestAccordMutationResolvers()
  private readonly notes = new FragranceRequestNoteMutationResolvers()
  private readonly votes = new FragranceRequestVoteMutationResolvers()

  createFragranceRequest: MutationResolvers['createFragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const values = mapCreateFragranceRequestInputToRow(input)
    const { fragranceRequests } = services

    return await fragranceRequests
      .withTransaction(trx => trx
        .createOne({ ...values, userId: me.id })
        .andThrough(request => trx
          .votes
          .counts
          .createOne({ requestId: request.id })
        )
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  updateFragranceRequest: MutationResolvers['updateFragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, version } = input
    const { fragranceRequests } = services
    const values = mapUpdateFragranceRequestInputToRow(input)

    return await fragranceRequests
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('version', '=', version),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ]),
        eb => ({
          ...values,
          version: eb(eb.ref('version'), '+', 1)
        })
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  deleteFragranceRequest: MutationResolvers['deleteFragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { fragranceRequests } = services

    return await fragranceRequests
      .softDeleteOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ])
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  submitFragranceRequest: MutationResolvers['submitFragranceRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { fragranceRequests } = services

    return await fragranceRequests
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ]),
        { requestStatus: 'PENDING' }
      )
      .match(
        mapFragranceRequestRowToFragranceRequest,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.brands.getResolvers(),
      ...this.images.getResolvers(),
      ...this.traits.getResolvers(),
      ...this.accords.getResolvers(),
      ...this.notes.getResolvers(),
      ...this.votes.getResolvers(),

      createFragranceRequest: this.createFragranceRequest,
      updateFragranceRequest: this.updateFragranceRequest,
      deleteFragranceRequest: this.deleteFragranceRequest,

      submitFragranceRequest: this.submitFragranceRequest
    }
  }
}
