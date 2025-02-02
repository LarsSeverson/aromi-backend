import { Context } from '@src/graphql/schema/context'
import { Fragrance } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface ReactionsFields {
  likes: boolean
  dislikes: boolean
  reviews: boolean
}

const reactionsQuery = (fields: ReactionsFields): string => {
  const parts: string[] = []
  if (fields.likes) parts.push("'likes', f.likes_count")
  if (fields.dislikes) parts.push("'dislikes', f.dislikes_count")
  if (fields.reviews) parts.push("'reviews', f.reviews_count")

  return `JSONB_BUILD_OBJECT(${parts.join(', ')}) AS reactions`
}

export interface MyReactionsFields {
  reaction: boolean
}

const myReactionsQuery = (fields: MyReactionsFields): string => {
  const parts: string[] = []
  if (fields.reaction) parts.push("'reaction', fr.reaction")

  return `(
    SELECT JSONB_AGG(
      JSONB_BUILD_OBJECT(${parts.join(', ')})
    )
    FROM fragrance_reactions fr
    WHERE fr.fragrance_id = f.id
      AND fr.user_id = $2
      AND fr.deleted_at IS NULL
  ) AS my_reactions`
}

interface FragranceArgs {
  id: number
}

export const fragrance = async (_: undefined, args: FragranceArgs, ctx: Context, info: GraphQLResolveInfo): Promise<Fragrance | null> => {
  const userId = ctx.userId || null
  const fragranceId = args.id

  if (!fragranceId) return null

  const fields = graphqlFields(info)
  const selectFields: string[] = ['f.id', 'f.brand', 'f.name']

  if (fields.reactions) {
    const reactionFields: ReactionsFields = {
      likes: !!fields.reactions.likes,
      dislikes: !!fields.reactions.dislikes,
      reviews: !!fields.reactions.reviews
    }
    selectFields.push(reactionsQuery(reactionFields))
  }

  if (fields.myReactions) {
    const myReactionsFields: MyReactionsFields = {
      reaction: !!fields.my_reactions.reaction
    }
    selectFields.push(myReactionsQuery(myReactionsFields))
  }

  const query = `
    SELECT
      ${selectFields.join(',\n')},
      $2 AS _dummy
    FROM fragrances f
    WHERE f.id = $1;
  `
  const values = [fragranceId, userId]

  const result = await ctx.pool.query<Fragrance>(query, values)

  return result.rows[0]
}
