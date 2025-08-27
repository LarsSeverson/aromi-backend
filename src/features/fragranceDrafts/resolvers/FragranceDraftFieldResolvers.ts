import { ApiError, throwError } from '@src/common/error'
import { type FragranceDraftResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { mapFragranceDraftImageRowToFragranceImage } from '../utils/mappers'
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
        option => ({
          traitType: type,
          selectedOption: option
        }),
        throwError
      )
  }

  getResolvers (): FragranceDraftResolvers {
    return {
      image: this.image,
      trait: this.trait
    }
  }
}
