import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceImage } from '@src/graphql/types/fragranceTypes'
import { generateSignedUrl } from '@src/utils/s3'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface ImagesFields {
  id: boolean
  url: boolean
}

interface FragranceImagesArgs {
  limit?: number | undefined
  offset?: number | undefined
}

export const images = async (parent: Fragrance, args: FragranceImagesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceImage[] | null> => {
  const fragranceId = parent.id
  const { limit = 5, offset = 0 } = args

  if (!fragranceId) return null

  const fields: ImagesFields = graphqlFields(info)

  const query = `--sql
    SELECT
      id,
      s3_key AS url
    FROM fragrance_images
    WHERE fragrance_id = $1
    LIMIT $2
    OFFSET $3
  `
  const values = [fragranceId, limit, offset]

  const { rows } = await ctx.pool.query<FragranceImage>(query, values)

  const images = await Promise.all(rows.map<Promise<FragranceImage>>(async image => {
    try {
      const url = await generateSignedUrl(image.url)
      return { id: image.id, url }
    } catch (error) {
      return { id: image.id, url: '' }
    }
  }))

  return images
}
