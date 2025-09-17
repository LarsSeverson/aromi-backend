import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceTraitMutationResolvers } from './FragranceTraitMutationResolvers.js'

export class FragranceMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly traits = new FragranceTraitMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.traits.getResolvers()
    }
  }
}