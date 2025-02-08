import { Context } from '@src/graphql/schema/context'
import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface FragranceReactionsFields {
  likes: boolean
  dislikes: boolean
  reviews: boolean
  rating: boolean
}

const reactionPart = (fields: FragranceReactionsFields): string => {
  const parts: string[] = []

  if (fields.likes) parts.push("'likes', f.likes_count")
  if (fields.dislikes) parts.push("'dislikes', f.dislikes_count")
  if (fields.reviews) parts.push("'reviews', f.reviews_count")
  if (fields.rating) parts.push("'rating', f.rating")

  return `JSONB_BUILD_OBJECT(${parts.join(', ')}) AS reactions`
}

export interface FragranceFields {
  id: boolean
  brand: boolean
  name: boolean

  reactions: FragranceReactionsFields
}

const fragranceQueryParts = (fields: FragranceFields): string[] => {
  const parts: string[] = []

  parts.push("'id', f.id")
  if (fields.brand) parts.push("'brand', f.brand")
  if (fields.name) parts.push("'name', f.name")
  if (fields.reactions) parts.push(reactionPart(fields.reactions))

  return parts
}

export interface MyReactionsFields {
  reaction: boolean
}

interface FragranceArgs {
  id: boolean
}

export const fragrance = async (_: undefined, args: FragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance | null> => {
  const { id } = args

  if (!id) {
    return null
  }

  const fields = graphqlFields(info)

  const parts = fragranceQueryParts(fields)

  const query = `
    SELECT ${parts.join(', ')}
    FROM fragrances f
    WHERE f.id = $1
  `
  const values = [id]

  const result = await ctx.pool.query<Fragrance>(query, values)

  const fragrance = result.rows[0]

  return fragrance
}
