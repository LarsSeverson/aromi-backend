import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { BrandEditMutationResolvers } from './BrandEditMutationResolvers.js'

export class BrandMutationResolvers extends BaseResolver<MutationResolvers> {
  private readonly edits = new BrandEditMutationResolvers()

  getResolvers (): MutationResolvers {
    return {
      ...this.edits.getResolvers()
    }
  }
}