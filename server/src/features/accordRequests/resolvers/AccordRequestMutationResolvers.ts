import { type MutationResolvers } from '@src/graphql/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { AccordRequestImageMutationResolvers } from './AccordRequestImageMutationResolvers'
import { mapAccordRequestRowToAccordRequestSummary, mapCreateAccordRequestInputToRow, mapUpdateAccordRequestInputToRow } from '../utils/mappers'
import { throwError } from '@aromi/shared/utils/error'
import { AccordRequestVoteMutationResolvers } from './AccordRequestVoteMutationResolvers'

export class AccordRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly images = new AccordRequestImageMutationResolvers()
  private readonly votes = new AccordRequestVoteMutationResolvers()

  createAccordRequest: MutationResolvers['createAccordRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const values = mapCreateAccordRequestInputToRow(input)
    const { accordRequests } = services

    return await accordRequests
      .createOne({ ...values, userId: me.id })
      .match(
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  updateAccordRequest: MutationResolvers['updateAccordRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, version } = input
    const values = mapUpdateAccordRequestInputToRow(input)
    const { accordRequests } = services

    return await accordRequests
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
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  deleteAccordRequest: MutationResolvers['deleteAccordRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { accordRequests } = services

    return await accordRequests
      .softDeleteOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ])
      )
      .match(
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  submitAccordRequest: MutationResolvers['submitAccordRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { accordRequests } = services

    return await accordRequests
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', '=', 'DRAFT')
        ]),
        { requestStatus: 'PENDING' }
      )
      .match(
        mapAccordRequestRowToAccordRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.images.getResolvers(),
      ...this.votes.getResolvers(),

      createAccordRequest: this.createAccordRequest,
      updateAccordRequest: this.updateAccordRequest,
      deleteAccordRequest: this.deleteAccordRequest,
      submitAccordRequest: this.submitAccordRequest
    }
  }
}
