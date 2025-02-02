import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

export interface AccordsFields {
  id: boolean
  name: boolean
  color: boolean
  votes: boolean
  myVote: boolean
}

const accordsQueryParts = (fields: AccordsFields): string[] => {
  const parts: string[] = []

  if (fields.id) parts.push("'id', fa.id")
  if (fields.name) parts.push("'name', a.name")
  if (fields.color) parts.push("'color', a.color")
  if (fields.votes) parts.push("'votes', fa.votes")
  if (fields.myVote) {
    parts.push(`'myVote', (
      SELECT EXISTS (
        SELECT 1
        FROM fragrance_accord_votes
        WHERE fragrance_accord_id = fa.id
          AND user_id = $2
          AND deleted_at IS NULL
      )
    )`)
  }

  return parts
}

interface FragranceAccordsArgs {
  limit: number
  offset: number
}

export const accords = async (parent: Fragrance, args: FragranceAccordsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceAccord[] | null> => {
  const userId = ctx.userId || null
  const fragranceId = parent.id
  const { limit = 10, offset = 0 } = args

  if (!fragranceId) return null

  const fields: AccordsFields = graphqlFields(info)

  const parts = accordsQueryParts(fields)

  const query = `
    SELECT COALESCE(JSONB_AGG(
      JSONB_BUILD_OBJECT(${parts.join(', ')})
      ORDER BY fa.votes DESC
    ), '[]'::JSONB) AS accords,
    $2 AS _dummy
    FROM fragrance_accords fa
    JOIN accords a ON a.id = fa.accord_id
    WHERE fa.fragrance_id = $1
    LIMIT $3
    OFFSET $4
  `
  const values = [fragranceId, userId, limit, offset]

  const result = await ctx.pool.query<{'accords': FragranceAccord[]}>(query, values)

  const accords = result.rows[0].accords

  return accords
}
