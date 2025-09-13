import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { VoteOnFRResolver } from '../helpers/VoteOnFRResolver.js'

export class FragranceRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnFragranceRequest: MutationResolvers['voteOnFragranceRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { services } = context
    const { fragranceRequests } = services

    const resolver = new VoteOnFRResolver({ parent, args, context, info, service: fragranceRequests })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnFragranceRequest: this.voteOnFragranceRequest
    }
  }
}
