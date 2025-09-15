import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { SetFRBrandResolver } from '../helpers/SetFRBrandResolver.js'

export class FragranceRequestBrandMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceRequestBrand: MutationResolvers['setFragranceRequestBrand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFRBrandResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestBrand: this.setFragranceRequestBrand
    }
  }
}
