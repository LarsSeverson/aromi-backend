import { unwrapOrThrow } from '@aromi/shared'
import type { FragranceResolvers } from '@src/graphql/gql-types.js'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { FragranceImagesResolver } from '../helpers/FragranceImagesResolver.js'
import { FragranceAccordsResolver } from '../helpers/FragranceAccordsResolver.js'
import { FragranceNotesResolver } from '../helpers/FragranceNotesResolver.js'
import { FragranceTraitsResolver } from '../helpers/FragranceTraitsResolver.js'
import { FragranceReviewPaginationFactory } from '../factories/FragranceReviewPaginationFactory.js'
import { mapFragranceReviewRowToFragranceReview, mapGQLNoteLayerToDBNoteLayer } from '../utils/mappers.js'
import { DBTraitToGQLTrait } from '@src/features/traits/utils/mappers.js'
import { VOTE_TYPES } from '@src/utils/constants.js'

export class FragranceFieldResolvers extends BaseResolver<FragranceResolvers> {
  private readonly reviewPagination = new FragranceReviewPaginationFactory()

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

  thumbnail: FragranceResolvers['thumbnail'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { loaders } = context

    const { fragrances } = loaders

    const image = await unwrapOrThrow(fragrances.loadThumbnail(id))

    return image
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

  myAccords: FragranceResolvers['myAccords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, services } = context

    if (me == null) return []

    const { fragrances, accords } = services

    const votes = await unwrapOrThrow(
      fragrances
        .accords
        .votes
        .find(
          where => where.and([
            where('fragranceId', '=', id),
            where('userId', '=', me.id),
            where('vote', '=', 1)
          ])
        )
    )

    if (votes.length === 0) return []

    const myAccords = await unwrapOrThrow(
      accords.find(where => where('id', 'in', votes.map(v => v.accordId)))
    )

    return myAccords
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

  myNotes: FragranceResolvers['myNotes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { layer } = args
    const { me, services } = context

    if (me == null) return []

    const { fragrances, notes } = services

    const votes = await unwrapOrThrow(
      fragrances
        .notes
        .votes
        .find(
          where => where.and([
            where('fragranceId', '=', id),
            where('userId', '=', me.id),
            where('layer', '=', mapGQLNoteLayerToDBNoteLayer(layer)),
            where('vote', '=', VOTE_TYPES.UPVOTE)
          ])
        )
    )

    if (votes.length === 0) return []

    const myNotes = await unwrapOrThrow(
      notes.find(where => where('id', 'in', votes.map(v => v.noteId)))
    )

    return myNotes
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

  myTraits: FragranceResolvers['myTraits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, services, loaders } = context

    if (me == null) return []

    const { fragrances } = loaders
    const { traits } = services

    const votes = await unwrapOrThrow(
      fragrances.loadUserTraitVotes(id, me.id)
    )

    const types = await unwrapOrThrow(
      traits.types.find(
        where => where('id', 'in', votes.map(v => v.traitTypeId)
        )
      )
    )

    const options = await unwrapOrThrow(
      traits.options.find(
        where => where.and([
          where('traitTypeId', 'in', votes.map(v => v.traitTypeId)),
          where('id', 'in', votes.map(v => v.traitOptionId))
        ])
      )
    )

    const typeMap = new Map(types.map(t => [t.id, t]))
    const optionMap = new Map(options.map(o => [o.traitTypeId, o]))

    const myTraits = votes.map(vote => {
      const { id } = vote
      const type = typeMap.get(vote.traitTypeId)!
      const option = optionMap.get(vote.traitTypeId)!

      return {
        id,
        type: DBTraitToGQLTrait[type.name],
        option
      }
    })

    return myTraits
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

  myReview: FragranceResolvers['myReview'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, services } = context

    if (me == null) return null

    const { fragrances } = services

    const review = await unwrapOrThrow(
      fragrances.reviews.findOne(
        where => where.and([
          where('fragranceId', '=', id),
          where('userId', '=', me.id)
        ])
      )
    )

    if (review == null) return null

    return mapFragranceReviewRowToFragranceReview(review)
  }

  reviews: FragranceResolvers['reviews'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { input } = args
    const { services } = context

    const pagination = this.reviewPagination.parse(input)
    const { fragrances } = services

    const reviews = await unwrapOrThrow(
      fragrances
        .reviews
        .find(
          where => where('fragranceId', '=', id),
          { pagination }
        )
    )

    const connection = this.pageFactory.paginate(reviews, pagination)
    const transformed = this.pageFactory.transform(connection, mapFragranceReviewRowToFragranceReview)

    return transformed
  }

  reviewInfo: FragranceResolvers['reviewInfo'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragrances } = services

    const scoresRes = await fragrances.scores.findOne(where => where('fragranceId', '=', id))
    const { averageRating, reviewCount } = scoresRes.unwrapOr({ averageRating: null, reviewCount: 0 })

    const distribution = await unwrapOrThrow(
      fragrances.reviews.distrbution(id)
    )

    const reviewInfo = {
      count: reviewCount,
      averageRating,
      distribution
    }

    return reviewInfo
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
      thumbnail: this.thumbnail,
      images: this.images,

      myAccords: this.myAccords,
      accords: this.accords,

      myNotes: this.myNotes,
      notes: this.notes,

      myTraits: this.myTraits,
      traits: this.traits,

      myReview: this.myReview,
      reviews: this.reviews,
      reviewInfo: this.reviewInfo,

      votes: this.votes
    }
  }
}
