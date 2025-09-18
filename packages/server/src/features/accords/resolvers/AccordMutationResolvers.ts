import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { AccordEditMutationResolvers } from './AccordEditMutationResolvers.js'

export class AccordMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new AccordEditMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.edits.getResolvers()
    }
  }
}