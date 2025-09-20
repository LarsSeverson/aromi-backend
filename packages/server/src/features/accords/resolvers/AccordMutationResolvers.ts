import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { AccordEditMutationResolvers } from './AccordEditMutationResolvers.js'
import { AccordRequestMutationResolvers } from './AccordRequestMutationResolvers.js'

export class AccordMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new AccordEditMutationResolvers()
  private readonly requests = new AccordRequestMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.edits.getResolvers(),
      ...this.requests.getResolvers()
    }
  }
}