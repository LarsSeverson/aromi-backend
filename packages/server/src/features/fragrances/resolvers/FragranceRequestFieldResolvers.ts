import { throwError, unwrapOrThrow } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver.js'
import { mapCombinedTraitRowToRequestTrait, mapDBNoteLayerToGQLNoteLayer } from '../utils/mappers.js'
import { GQLTraitToDBTrait } from '@src/features/traits/utils/mappers.js'
import { mapGQLNoteLayerToDBNoteLayer } from '@src/features/fragrances/utils/mappers.js'
import type { FragranceRequestResolvers } from '@src/graphql/gql-types.js'
import { mapUserRowToUserSummary } from '@src/features/users/utils/mappers.js'

export class FragranceRequestFieldResolvers extends BaseResolver<FragranceRequestResolvers> {
  brand: FragranceRequestResolvers['brand'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { brandId } = parent
    const { services } = context

    if (brandId == null) return null

    const { brands } = services

    return await brands
      .findOne(eb => eb('id', '=', brandId))
      .match(
        row => row,
        throwError
      )
  }

  image: FragranceRequestResolvers['image'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { assetId } = parent
    if (assetId == null) return null

    const { services } = context
    const { assets } = services

    const asset = await unwrapOrThrow(
      assets
        .uploads
        .findOne(eb => eb('id', '=', assetId))
    )

    return asset
  }

  trait: FragranceRequestResolvers['trait'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { type } = args
    const { services } = context

    const dbType = GQLTraitToDBTrait[type]
    const { fragrances } = services

    const trait = await unwrapOrThrow(
      fragrances
        .requests
        .traits
        .findTrait(
          eb => eb.and([
            eb('requestId', '=', id),
            eb('traitTypes.name', '=', dbType)
          ])
        )
    )

    return mapCombinedTraitRowToRequestTrait(trait)
  }

  traits: FragranceRequestResolvers['traits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragrances } = services

    const traits = await unwrapOrThrow(
      fragrances
        .requests
        .traits
        .findTraits(
          eb => eb('requestId', '=', id)
        )
    )

    return traits.map(mapCombinedTraitRowToRequestTrait)
  }

  accords: FragranceRequestResolvers['accords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragrances } = services

    const accords = await unwrapOrThrow(
      fragrances
        .requests
        .accords
        .findAccords(
          eb => eb('requestId', '=', id)
        )
    )

    return accords
  }

  notes: FragranceRequestResolvers['notes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { layer } = args
    const { services } = context

    const dbLayer = mapGQLNoteLayerToDBNoteLayer(layer)
    const { fragrances } = services

    const notes = await unwrapOrThrow(
      fragrances
        .requests
        .notes
        .findNotes(
          eb => eb.and([
            eb('fragranceRequestNotes.requestId', '=', id),
            eb('fragranceRequestNotes.layer', '=', dbLayer)
          ])
        )
    )

    return notes.map(note => ({
      id: note.id,
      note: {
        id: note.id,
        name: note.name,
        description: note.description,
        thumbnailImageId: note.thumbnailImageId
      },
      layer: mapDBNoteLayerToGQLNoteLayer(note.layer)
    }))
  }

  votes: FragranceRequestResolvers['votes'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { me, loaders } = context

    const { fragranceRequests } = loaders

    const score = await unwrapOrThrow(fragranceRequests.loadScore(id))
    const myVoteRow = await unwrapOrThrow(fragranceRequests.loadUserVote(id, me?.id))

    const votes = {
      upvotes: score?.upvotes ?? 0,
      downvotes: score?.downvotes ?? 0,
      score: score?.score ?? 0,
      myVote: myVoteRow?.vote
    }

    return votes
  }

  user: FragranceRequestResolvers['user'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { userId } = parent
    const { services } = context

    const { users } = services

    const user = await unwrapOrThrow(
      users
        .findOne(eb => eb('id', '=', userId))
    )

    return mapUserRowToUserSummary(user)
  }

  getResolvers (): FragranceRequestResolvers {
    return {
      brand: this.brand,
      image: this.image,
      trait: this.trait,
      traits: this.traits,
      accords: this.accords,
      notes: this.notes,
      votes: this.votes,
      user: this.user
    }
  }
}
