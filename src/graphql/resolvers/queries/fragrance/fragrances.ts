import { Context } from '@src/graphql/schema/context'
import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface FragranceReactionsFields {
  likes: boolean
  dislikes: boolean
  reviews: boolean
}

const reactionPart = (fields: FragranceReactionsFields): string => {
  const parts: string[] = []

  if (fields.likes) parts.push("'likes', f.likes_count")
  if (fields.dislikes) parts.push("'dislikes', f.dislikes_count")
  if (fields.reviews) parts.push("'reviews', f.reviews_count")

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

  if (fields.id) parts.push("'id', f.id")
  if (fields.brand) parts.push("'brand', f.brand")
  if (fields.name) parts.push("'name', f.name")
  if (fields.reactions) parts.push(reactionPart(fields.reactions))

  return parts
}

export interface MyReactionsFields {
  reaction: boolean
}

interface FragrancesArgs {
  limit?: number | undefined
  offset?: number | undefined
}

export const fragrances = async (_: undefined, args: FragrancesArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance[] | null> => {
  const limit = args.limit ?? 10
  const offset = args.offset ?? 0

  const fields = graphqlFields(info)

  const parts = fragranceQueryParts(fields)

  const query = `
    SELECT ${parts.join(', ')}
    FROM fragrances f
    ORDER BY id
    LIMIT $1
    OFFSET $2 
  `
  const values = [limit, offset]

  const result = await ctx.pool.query<Fragrance>(query, values)

  const fragrances = result.rows

  return fragrances
}
