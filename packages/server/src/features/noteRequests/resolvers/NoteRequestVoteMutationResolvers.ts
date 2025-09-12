import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { VoteOnNRResolver } from '../helpers/VoteOnNRResolver.js'

export class NoteRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnNoteRequest: MutationResolvers['voteOnNoteRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnNRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnNoteRequest: this.voteOnNoteRequest
    }
  }
}
