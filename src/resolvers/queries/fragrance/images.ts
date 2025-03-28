import { type FragranceResolvers } from '@src/generated/gql-types'
import { getPage, getPaginationInput } from '@src/common/pagination'
import { getSortColumns } from '@src/common/sort-map'
import { encodeCursor } from '@src/common/cursor'
import { type FragranceImageKey } from '@src/common/loaders/fragrance-images-loader'

export const images: FragranceResolvers['images'] = async (parent, args, context, info) => {
  const { id: fragranceId } = parent
  const { input } = args
  const { first, after, sort } = getPaginationInput(input?.pagination)
  const { gqlColumn } = getSortColumns(sort.by)
  const { dataLoaders } = context

  const key: FragranceImageKey = { fragranceId, sort, first, after }
  const images = await dataLoaders.fragranceImages.load(key)

  const edges = images.map(image => ({
    node: image,
    cursor: encodeCursor(image[gqlColumn], image.id)
  }))

  return getPage(edges, first, after)
}
