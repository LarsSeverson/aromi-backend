import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { SetFRNotesResolver } from '../helpers/SetFRNotesResolver.js'

export class FragranceRequestNoteMutationResolvers extends BaseResolver<MutationResolvers> {
  setFragrancRequestNotes: MutationResolvers['setFragranceRequestNotes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new SetFRNotesResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      setFragranceRequestNotes: this.setFragrancRequestNotes
    }
  }
}
