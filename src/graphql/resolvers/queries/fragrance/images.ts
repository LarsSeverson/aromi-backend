import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceImage } from '@src/graphql/types/fragranceTypes'
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
    id,
    s3_key AS url
    FROM fragrance_images
    WHERE fragrance_id = $1
    LIMIT $2
    OFFSET $3
  `
  const values = [fragranceId, limit, offset]

  const result = await ctx.pool.query<FragranceImage>(query, values)

  const images = result.rows

  return images
}
