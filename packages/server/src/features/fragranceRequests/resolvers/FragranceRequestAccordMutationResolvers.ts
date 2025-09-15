import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { SetFRAccordsResolver } from '../helpers/SetFRAccordsResolver.js'

export class FragranceRequestAccordMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragranceRequestAccords: MutationResolvers['setFragranceRequestAccords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFRAccordsResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestAccords: this.setFragranceRequestAccords
    }
  }
}
