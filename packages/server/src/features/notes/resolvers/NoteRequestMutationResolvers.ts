import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { CreateNoteRequestResolver } from '../helpers/CreateNoteRequestResolver.js'
import { UpdateNoteRequestResolver } from '../helpers/UpdateNoteRequestResolver.js'
import { DeleteNoteRequestResolver } from '../helpers/DeleteNoteRequestResolver.js'
import { SubmitNoteRequestResolver } from '../helpers/SubmitNoteRequestResolver.js'
import { VoteOnNoteRequestResolver } from '../helpers/VoteOnNoteRequestResolver.js'

export class NoteRequestMutationResolvers extends BaseResolver<MutationResolvers> {
  createNoteRequest: MutationResolvers['createNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new CreateNoteRequestResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  updateNoteRequest: MutationResolvers['updateNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new UpdateNoteRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  deleteNoteRequest: MutationResolvers['deleteNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new DeleteNoteRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  submitNoteRequest: MutationResolvers['submitNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SubmitNoteRequestResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  voteOnNoteRequest: MutationResolvers['voteOnNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnNoteRequestResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): MutationResolvers {
    return {
      createNoteRequest: this.createNoteRequest,
      updateNoteRequest: this.updateNoteRequest,
      deleteNoteRequest: this.deleteNoteRequest,
      submitNoteRequest: this.submitNoteRequest,
      voteOnNoteRequest: this.voteOnNoteRequest
    }
  }
}
