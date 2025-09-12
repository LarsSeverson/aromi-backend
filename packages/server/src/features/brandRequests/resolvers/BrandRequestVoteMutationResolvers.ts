import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { VoteOnBRResolver } from '../helpers/VoteOnBRRequest.js'

export class BrandRequestVoteMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnBrandRequest: MutationResolvers['voteOnBrandRequest'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnBRResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnBrandRequest: this.voteOnBrandRequest
    }
  }
}
