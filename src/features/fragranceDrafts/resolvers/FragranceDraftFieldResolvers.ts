import { ApiError, throwError } from '@src/common/error'
import { type FragranceDraftResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { mapDraftTraitResultToDraftTrait, mapFragranceDraftImageRowToFragranceImage } from '../utils/mappers'
import { GQLTraitToDBTrait } from '@src/features/traits/utils/mappers'

export class FragranceDraftFieldResolvers extends BaseResolver<FragranceDraftResolvers> {
  image: FragranceDraftResolvers['image'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services, loaders } = context

    const { fragranceDrafts } = loaders
    const { assets } = services

    return await ResultAsync
      .fromPromise(
        fragranceDrafts
          .getImageLoader()
          .load(id),
        error => ApiError.fromDatabase(error)
      )
      .match(
        row => {
          if (row == null) return null

          const image = mapFragranceDraftImageRowToFragranceImage(row)
          image.url = assets.getCdnUrl(row.s3Key)

          return image
        },
        throwError
      )
  }

  trait: FragranceDraftResolvers['trait'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { type } = args
    const { services } = context

    const dbType = GQLTraitToDBTrait[type]
    const { traits, fragranceDrafts } = services

    return await traits
      .types
      .findOne(
        eb => eb('name', '=', dbType)
      )
      .andThen(traitType => fragranceDrafts
        .traits
        .findOne(
          eb => eb.and([
            eb('draftId', '=', id),
            eb('traitTypeId', '=', traitType.id)
          ])
        )
        .orElse(error => {
          if (error.status === 404) {
            return okAsync(null)
          }
          return errAsync(error)
        })
      )
      .andThen(draftTrait => {
        if (draftTrait == null) {
          return okAsync(null)
        }

        return traits
          .options
          .findOne(
            eb => eb('id', '=', draftTrait.traitOptionId)
          )
      })
      .match(
        optionRow => ({
          traitType: type,
          selectedOption: optionRow
        }),
        throwError
      )
  }

  traits: FragranceDraftResolvers['traits'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragranceDrafts } = services

    return await fragranceDrafts
      .traits
      .getDraftTraits(id)
      .match(
        results => results.map(mapDraftTraitResultToDraftTrait),
        throwError
      )
  }

  accords: FragranceDraftResolvers['accords'] = async (
    parent,
    args,
    context,
    info
  ) => {
    const { id } = parent
    const { services } = context

    const { fragranceDrafts } = services

    return await fragranceDrafts
      .accords
      .findAccords(
        eb => eb('fragranceDraftAccords.draftId', '=', id)
      )
      .match(
        rows => rows,
        throwError
      )
  }

  getResolvers (): FragranceDraftResolvers {
    return {
      image: this.image,
      trait: this.trait,
      traits: this.traits,
      accords: this.accords
    }
  }
}
