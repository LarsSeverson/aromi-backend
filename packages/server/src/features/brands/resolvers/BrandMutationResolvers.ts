import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { BrandEditMutationResolvers } from './BrandEditMutationResolvers.js'
import { BrandRequestMutationResolvers } from './BrandRequestMutationResolvers.js'

export class BrandMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new BrandEditMutationResolvers()
  private readonly request = new BrandRequestMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.edits.getResolvers(),
      ...this.request.getResolvers()
    }
  }
}