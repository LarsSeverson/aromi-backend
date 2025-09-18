import type { MutationResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { VoteOnTraitResolver } from '../helpers/VoteOnTraitResolver.js'
import { unwrapOrThrow } from '@aromi/shared'
import { VoteOnAccordResolver } from '../helpers/VoteOnAccordResolver.js'
import { VoteOnNoteResolver } from '../helpers/VoteOnNoteResolver.js'

export class FragranceVotingMutationResolvers extends BaseResolver<MutationResolvers> {
  voteOnFragranceTrait: MutationResolvers['voteOnFragranceTrait'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnTraitResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  voteOnFragranceAccord: MutationResolvers['voteOnFragranceAccord'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnAccordResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  voteOnFragranceNote: MutationResolvers['voteOnFragranceNote'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new VoteOnNoteResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  getResolvers (): MutationResolvers {
    return {
      voteOnFragranceTrait: this.voteOnFragranceTrait,
      voteOnFragranceAccord: this.voteOnFragranceAccord,
      voteOnFragranceNote: this.voteOnFragranceNote
    }
  }
}