import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceVotingMutationResolvers } from './FragranceVotingMutationResolvers.js'
import { FragranceEditMutationResolvers } from './FragranceEditMutationResolvers.js'
import { FragranceRequestMutationResolvers } from './FragranceRequestMutationResolvers.js'
import { FragranceCollectionMutationResolvers } from './FragranceCollectionMutationResolvers.js'

export class FragranceMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new FragranceEditMutationResolvers()
  private readonly requests = new FragranceRequestMutationResolvers()
  private readonly votes = new FragranceVotingMutationResolvers()
  private readonly collections = new FragranceCollectionMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.votes.getResolvers(),
      ...this.requests.getResolvers(),
      ...this.edits.getResolvers(),
      ...this.collections.getResolvers()
    }
  }
}