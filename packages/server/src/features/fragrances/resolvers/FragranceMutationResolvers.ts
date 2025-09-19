import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceVotingMutationResolvers } from './FragranceVotingMutationResolvers.js'
import { FragranceEditMutationResolvers } from './FragranceEditMutationResolvers.js'

export class FragranceMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new FragranceEditMutationResolvers()
  private readonly votes = new FragranceVotingMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.votes.getResolvers(),
      ...this.edits.getResolvers()
    }
  }
}