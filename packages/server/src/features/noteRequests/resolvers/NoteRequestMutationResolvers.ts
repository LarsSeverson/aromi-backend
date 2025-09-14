import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapNoteRequestRowToNoteRequestSummary, mapCreateNoteRequestInputToRow, mapUpdateNoteRequestInputToRow } from '../utils/mappers.js'
import { BackendError, parseOrThrow, throwError, unwrapOrThrow, ValidNote } from '@aromi/shared'
import { NoteRequestImageMutationResolvers } from './NoteRequestImageMutationResolvers.js'
import { NoteRequestVoteMutationResolvers } from './NoteRequestVoteMutationResolvers.js'

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
      .createOne({ ...values, userId: me.id })
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
                'A note request must have at least one image before it can be submitted.',
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

        parseOrThrow(ValidNote, request)

        return request
      })
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
