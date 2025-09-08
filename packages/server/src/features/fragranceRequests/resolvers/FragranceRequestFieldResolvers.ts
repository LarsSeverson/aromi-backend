import { ApiError, throwError } from '@aromi/shared'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { ResultAsync } from 'neverthrow'
import { mapCombinedTraitRowToRequestTrait, mapFragranceRequesttImageRowToFragranceImage } from '../utils/mappers'
import { GQLTraitToDBTrait } from '@src/features/traits/utils/mappers'
import { mapGQLNoteLayerToDBNoteLayer } from '@src/features/fragrances/utils/mappers'
import { type FragranceRequestResolvers } from '@src/graphql/gql-types'
import { mapVoteInfoRowToVoteInfo } from '@src/utils/mappers'

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
    const { id } = parent
    const { services, loaders } = context

    const { fragranceRequests } = loaders
    const { assets } = services

    return await ResultAsync
      .fromPromise(
        fragranceRequests
          .getImageLoader()
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        row => {
          if (row == null) return null

          const image = mapFragranceRequesttImageRowToFragranceImage(row)
          image.url = assets.getCdnUrl(row.s3Key)

          return image
        },
        throwError
      )
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
    const { fragranceRequests } = services

    return await fragranceRequests
      .traits
      .findTrait(
        eb => eb.and([
          eb('requestId', '=', id),
          eb('traitTypes.name', '=', dbType)
        ])
      )
      .match(
        mapCombinedTraitRowToRequestTrait,
        throwError
      )
  }

  traits: FragranceRequestResolvers['traits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragranceRequests } = services

    return await fragranceRequests
      .traits
      .findTraits(
        eb => eb('requestId', '=', id)
      )
      .match(
        rows => rows.map(mapCombinedTraitRowToRequestTrait),
        throwError
      )
  }

  accords: FragranceRequestResolvers['accords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragranceRequests } = services

    return await fragranceRequests
      .accords
      .findAccords(
        eb => eb('requestId', '=', id)
      )
      .match(
        rows => rows,
        throwError
      )
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
    const { fragranceRequests } = services

    return await fragranceRequests
      .notes
      .findNotes(
        eb => eb.and([
          eb('fragranceRequestNotes.requestId', '=', id),
          eb('fragranceRequestNotes.layer', '=', dbLayer)
        ])
      )
      .match(
        rows => rows,
        throwError
      )
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

    return await ResultAsync
      .fromPromise(
        fragranceRequests
          .getVotesLoader(me?.id)
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        mapVoteInfoRowToVoteInfo,
        throwError
      )
  }

  getResolvers (): FragranceRequestResolvers {
    return {
      brand: this.brand,
      image: this.image,
      trait: this.trait,
      traits: this.traits,
      accords: this.accords,
      notes: this.notes,
      votes: this.votes
    }
  }
}
