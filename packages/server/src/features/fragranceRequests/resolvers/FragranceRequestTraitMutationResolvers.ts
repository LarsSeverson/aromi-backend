import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { SetFRTraitResolver } from '../helpers/SetFRTraitResolver.js'

export class FragranceRequestTraitMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceRequestTrait: MutationResolvers['setFragranceRequestTrait'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFRTraitResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestTrait: this.setFragranceRequestTrait
    }
  }
}
