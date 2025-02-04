import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

const noFillQuery = (queryParts: string[]) => `--sql
  SELECT COALESCE(JSONB_AGG(
    JSONB_BUILD_OBJECT(${queryParts.join(', ')})
    ORDER BY fa.votes DESC
  ), '[]'::JSONB) as accords,
  $2 as _dummy
  FROM fragrance_accords fa
  JOIN accords a ON a.id = fa.accord_id
  LEFT JOIN (
    SELECT fragrance_accord_id, TRUE AS user_vote
    FROM fragrance_accord_votes
    WHERE user_id = $2 AND deleted_at IS NULL
  ) fav ON fav.fragrance_accord_id = fa.id
  WHERE fa.fragrance_id = $1
  LIMIT $3
  OFFSET $4
`

const fillQuery = (queryParts: string[], fillerParts: string[]) => `--sql
  SELECT COALESCE(JSONB_AGG(t.item ORDER BY t.order_votes DESC), '[]'::JSONB) AS accords,
  $2 AS _dummy
  FROM (
    SELECT *
    FROM (
      SELECT JSONB_BUILD_OBJECT(${queryParts.join(', ')}) AS item, fa.votes AS order_votes
      FROM fragrance_accords fa
      JOIN accords a ON a.id = fa.accord_id
      LEFT JOIN (
        SELECT fragrance_accord_id, TRUE AS user_vote
        FROM fragrance_accord_votes
        WHERE user_id = $2 AND deleted_at IS NULL
      ) fav ON fav.fragrance_accord_id = fa.id
      WHERE fa.fragrance_id = $1
      UNION ALL
      SELECT JSONB_BUILD_OBJECT(${fillerParts.join(', ')}) AS item, 0 AS order_votes
      FROM accords a
      WHERE a.id NOT IN (
        SELECT accord_id FROM fragrance_accords WHERE fragrance_id = $1
      )
    ) combined
    ORDER BY order_votes DESC
    LIMIT $3
    OFFSET $4
  ) t
`

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
  if (fields.myVote) parts.push("'myVote', COALESCE(fav.user_vote, false)")

  return parts
}

const accordsFillerQueryParts = (fields: AccordsFields): string[] => {
  const parts: string[] = []

  if (fields.id) parts.push("'id', a.id")
  if (fields.name) parts.push("'name', a.name")
  if (fields.color) parts.push("'color', a.color")
  if (fields.votes) parts.push("'votes', 0")
  if (fields.myVote) parts.push("'myVote', false")

  return parts
}

interface FragranceAccordsArgs {
  limit?: number | undefined
  offset?: number | undefined

  fill?: boolean | undefined
}

export const accords = async (parent: Fragrance, args: FragranceAccordsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceAccord[] | null> => {
  const user = ctx.user
  const fragranceId = parent.id

  const { limit = 10, offset = 0, fill = false } = args

  if (!fragranceId) return null

  const userId = user?.id || null
  const fields: AccordsFields = graphqlFields(info)

  const parts = accordsQueryParts(fields)
  const fillerParts = (fill && accordsFillerQueryParts(fields)) || []

  const query = fill ? fillQuery(parts, fillerParts) : noFillQuery(parts)
  const values = [fragranceId, userId, limit, offset]

  const result = await ctx.pool.query<{'accords': FragranceAccord[]}>(query, values)

  const accords = result.rows[0].accords

  return accords
}
