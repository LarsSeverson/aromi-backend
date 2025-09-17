import { unwrapOrThrow } from '@aromi/shared'
import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { VoteOnTraitResolver } from '../helpers/VoteOnTraitResolver.js'

export class FragranceTraitMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnFragranceTrait: MutationResolvers['voteOnFragranceTrait'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnTraitResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnFragranceTrait: this.voteOnFragranceTrait
    }
  }
}