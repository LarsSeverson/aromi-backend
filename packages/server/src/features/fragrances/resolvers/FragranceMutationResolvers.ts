import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceVotingMutationResolvers } from './FragranceVotingMutationResolvers.js'
import { FragranceEditMutationResolvers } from './FragranceEditMutationResolvers.js'
import { FragranceRequestMutationResolvers } from './FragranceRequestMutationResolvers.js'
import { FragranceCollectionMutationResolvers } from './FragranceCollectionMutationResolvers.js'
import { FragranceReviewMutationResolvers } from './FragranceReviewMutationResolvers.js'
import { FragranceReportMutationResolvers } from './FragranceReportMutationResolvers.js'

export class FragranceMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new FragranceEditMutationResolvers()
  private readonly requests = new FragranceRequestMutationResolvers()
  private readonly votes = new FragranceVotingMutationResolvers()
  private readonly collections = new FragranceCollectionMutationResolvers()
  private readonly reviews = new FragranceReviewMutationResolvers()
  private readonly reports = new FragranceReportMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.votes.getResolvers(),
      ...this.requests.getResolvers(),
      ...this.edits.getResolvers(),
      ...this.collections.getResolvers(),
      ...this.reviews.getResolvers(),
      ...this.reports.getResolvers()
    }
  }
}