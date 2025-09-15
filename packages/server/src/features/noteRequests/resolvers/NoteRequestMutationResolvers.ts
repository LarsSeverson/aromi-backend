import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { NoteRequestImageMutationResolvers } from './NoteRequestImageMutationResolvers.js'
import { NoteRequestVoteMutationResolvers } from './NoteRequestVoteMutationResolvers.js'
import { CreateNRResolver } from '../helpers/CreateNRResolver.js'
import { UpdateNRResolver } from '../helpers/UpdateNRResolver.js'
import { DeleteNRResolver } from '../helpers/DeleteNRResolver.js'
import { SubmitNRResolver } from '../helpers/SubmitNRResolver.js'

export class NoteRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly images = new NoteRequestImageMutationResolvers()
  private readonly votes = new NoteRequestVoteMutationResolvers()

  createNoteRequest: MutationResolvers['createNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateNRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  updateNoteRequest: MutationResolvers['updateNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateNRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteNoteRequest: MutationResolvers['deleteNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteNRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitNoteRequest: MutationResolvers['submitNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitNRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
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
