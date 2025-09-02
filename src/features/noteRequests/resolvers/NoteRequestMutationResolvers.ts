import { type MutationResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { mapNoteRequestRowToNoteRequestSummary, mapCreateNoteRequestInputToRow, mapUpdateNoteRequestInputToRow } from '../utils/mappers'
import { throwError } from '@src/common/error'
import { NoteRequestImageMutationResolvers } from './NoteRequestImageMutationResolvers'
import { NoteRequestVoteMutationResolvers } from './NoteRequestVoteMutationResolvers'

export class NoteRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly images = new NoteRequestImageMutationResolvers()
  private readonly votes = new NoteRequestVoteMutationResolvers()

  createNoteRequest: MutationResolvers['createNoteRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const values = mapCreateNoteRequestInputToRow(input)
    const { noteRequests } = services

    return await noteRequests
      .create({ ...values, userId: me.id })
      .match(
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  updateNoteRequest: MutationResolvers['updateNoteRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id, version } = input
    const values = mapUpdateNoteRequestInputToRow(input)
    const { noteRequests } = services

    return await noteRequests
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
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  deleteNoteRequest: MutationResolvers['deleteNoteRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { noteRequests } = services

    return await noteRequests
      .softDeleteOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', 'not in', ['ACCEPTED', 'DENIED'])
        ])
      )
      .match(
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  submitNoteRequest: MutationResolvers['submitNoteRequest'] = async (
    _,
    args,
    context,
    info
  ) => {
    const { input } = args
    const { services } = context
    const me = this.checkAuthenticated(context)

    const { id } = input
    const { noteRequests } = services

    return await noteRequests
      .updateOne(
        eb => eb.and([
          eb('id', '=', id),
          eb('userId', '=', me.id),
          eb('requestStatus', '=', 'DRAFT')
        ]),
        { requestStatus: 'PENDING' }
      )
      .match(
        mapNoteRequestRowToNoteRequestSummary,
        throwError
      )
  }

  getResolvers (): MutationResolvers {
    return {
      ...this.images.getResolvers(),
      ...this.votes.getResolvers(),

      createNoteRequest: this.createNoteRequest,
      updateNoteRequest: this.updateNoteRequest,
      deleteNoteRequest: this.deleteNoteRequest,
      submitNoteRequest: this.submitNoteRequest
    }
  }
}
