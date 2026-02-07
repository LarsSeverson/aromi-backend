import { unwrapOrThrow } from '@aromi/shared'
import type { FragranceTraitOptionResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'

export class FragranceTraitOptionFieldResolvers extends BaseResolver<FragranceTraitOptionResolvers> {
  votes: FragranceTraitOptionResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id: optionId, fragranceId } = parent
    const { me, loaders } = context

    const { fragrances } = loaders

    const score = await unwrapOrThrow(fragrances.traits.options.loadScore({ optionId, fragranceId }))
    const myVote = await unwrapOrThrow(fragrances.traits.options.loadUserVote({ optionId, fragranceId, userId: me?.id }))

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: myVote == null ? 0 : 1
    }

    return votes
  }

  getResolvers (): FragranceTraitOptionResolvers {
    return {
      votes: this.votes
    }
  }
}