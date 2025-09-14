import { unwrapOrThrow } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { VoteOnARResolver } from '../helpers/VoteOnARResolver.js'

export class AccordRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnAccordRequest: MutationResolvers['voteOnAccordRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnARResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnAccordRequest: this.voteOnAccordRequest
    }
  }
}
