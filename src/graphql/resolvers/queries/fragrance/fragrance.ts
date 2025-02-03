import { Context } from '@src/graphql/schema/context'
import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface FragranceFields {
  brand: boolean
  name: boolean
  likes: boolean
  dislikes: boolean
  reviews: boolean
}

const fragranceQueryParts = (fields: FragranceFields): string[] => {
  const parts: string[] = ["'id', f.id"]

  if (fields.brand) parts.push("'brand', f.brand")
  if (fields.name) parts.push("'name', f.name")
  if (fields.likes) parts.push("'likes', f.likes_count")
  if (fields.dislikes) parts.push("'dislikes', f.dislikes_count")
  if (fields.reviews) parts.push("'reviews', f.reviews_count")

  return parts
}

export interface MyReactionsFields {
  reaction: boolean
}

interface FragranceArgs {
  id: number
}

export const fragrance = async (_: undefined, args: FragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance | null> => {
  const fragranceId = args.id

  if (!fragranceId) return null

  const fields = graphqlFields(info)

  const parts = fragranceQueryParts(fields)

  const query = `--sql
    SELECT ${parts.join(', ')}
    FROM fragrances f
    WHERE f.id = $1;
  `
  const values = [fragranceId]

  const result = await ctx.pool.query<Fragrance>(query, values)

  const fragrance = result.rows[0]

  return fragrance
}
