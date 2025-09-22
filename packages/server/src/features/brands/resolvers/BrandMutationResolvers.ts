import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { BrandEditMutationResolvers } from './BrandEditMutationResolvers.js'
import { BrandRequestMutationResolvers } from './BrandRequestMutationResolvers.js'
import { VoteOnBrandResolver } from '../helpers/VoteOnBrandResolver.js'

export class BrandMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new BrandEditMutationResolvers()
  private readonly request = new BrandRequestMutationResolvers()

  voteOnBrand: MutationResolvers['voteOnBrand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnBrandResolver({ parent, args, context, info })
    return await resolver.resolve()
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnBrand: this.voteOnBrand,
      ...this.edits.getResolvers(),
      ...this.request.getResolvers()
    }
  }
}