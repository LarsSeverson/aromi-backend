import { unwrapOrThrow } from '@aromi/shared'
import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceImagesResolver } from '../helpers/FragranceImagesResolver.js'
import { FragranceAccordsResolver } from '../helpers/FragranceAccordsResolver.js'
import { FragranceNotesResolver } from '../helpers/FragranceNotesResolver.js'
import { FragranceTraitsResolver } from '../helpers/FragranceTraitsResolver.js'

export class FragranceFieldResolvers extends BaseResolver<FragranceResolvers> {
  brand: FragranceResolvers['brand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { brandId } = parent
    const { loaders } = context

    const { brands } = loaders

    const row = await unwrapOrThrow(brands.load(brandId))

    return row
  }

  images: FragranceResolvers['images'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FragranceImagesResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  accords: FragranceResolvers['accords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FragranceAccordsResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  notes: FragranceResolvers['notes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FragranceNotesResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  traits: FragranceResolvers['traits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const resolver = new FragranceTraitsResolver({ parent, args, context, info })
    return await unwrapOrThrow(resolver.resolve())
  }

  votes: FragranceResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, loaders } = context

    const { fragrances } = loaders

    const score = await unwrapOrThrow(fragrances.loadScore(id))
    const userVote = await unwrapOrThrow(fragrances.loadUserVote(id, me?.id))

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: userVote?.vote
    }

    return votes
  }

  getResolvers (): FragranceResolvers {
    return {
      brand: this.brand,
      images: this.images,
      accords: this.accords,
      notes: this.notes,
      traits: this.traits,
      votes: this.votes
    }
  }
}