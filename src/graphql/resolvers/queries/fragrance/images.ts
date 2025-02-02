import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord, FragranceImage } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface ImagesFields {
  id: boolean
  url: boolean
}

const imagesQueryParts = (fields: ImagesFields): string[] => {
  const parts: string[] = []
  if (fields.id) parts.push("'id', fi.id")
  if (fields.url) parts.push("'url', fi.s3_key")

  return parts
}

interface FragranceImagesArgs {
  limit: number
  offset: number
}

export const images = async (parent: Fragrance, args: FragranceImagesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceImage[] | null> => {
  const fragranceId = parent.id
  const { limit = 3, offset = 0 } = args

  if (!fragranceId) return null

  const fields: ImagesFields = graphqlFields(info)

  const parts = imagesQueryParts(fields)

  const query = `
    SELECT COALESCE(JSONB_AGG(
      JSONB_BUILD_OBJECT(${parts.join(', ')})
    ), '[]'::JSONB) AS images
    FROM fragrance_images fi
    WHERE fi.fragrance_id = $1
    LIMIT $2
    OFFSET $3
  `

  const values = [fragranceId, limit, offset]

  const result = await ctx.pool.query<{'images': FragranceImage[]}>(query, values)

  const images = result.rows[0].images

  return images
}
