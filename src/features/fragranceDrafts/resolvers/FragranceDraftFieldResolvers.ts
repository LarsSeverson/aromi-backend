import { ApiError, throwError } from '@src/common/error'
import { type FragranceDraftResolvers } from '@src/generated/gql-types'
import { BaseResolver } from '@src/resolvers/BaseResolver'
import { ResultAsync } from 'neverthrow'
import { mapFragranceDraftImageRowToFragranceImage } from '../utils/mappers'

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

  getResolvers (): FragranceDraftResolvers {
    return {
      image: this.image
    }
  }
}
