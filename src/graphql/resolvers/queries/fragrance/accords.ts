import { Context } from '@src/graphql/schema/context'
import { Fragrance, FragranceAccord } from '@src/graphql/types/fragranceTypes'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

const noFillQuery = () => `--sql
  SELECT
    fa.id,
    a.id as "accordId",
    a.name,
    a.color,
    fa.votes,
    EXISTS(
      SELECT 1
      FROM fragrance_accord_votes fav
      WHERE fav.fragrance_accord_id = fa.id
        AND fav.user_id = $2
        AND fav.deleted_at IS NULL
    ) AS "myVote"
  FROM fragrance_accords fa
  JOIN accords a ON a.id = fa.accord_id
  WHERE fa.fragrance_id = $1 AND fa.votes > 0
  ORDER BY fa.votes DESC
  LIMIT $3
  OFFSET $4
`

const fillQuery = () => `--sql
  WITH actual AS (
    SELECT
      fa.id,
      a.id AS "accordId",
      a.name,
      a.color,
      fa.votes,
      EXISTS(
        SELECT 1
        FROM fragrance_accord_votes fav
        WHERE fav.fragrance_accord_id = fa.id
          AND fav.user_id = $2
          AND fav.deleted_at IS NULL
      ) AS "myVote"
    FROM fragrance_accords fa
    JOIN accords a ON a.id = fa.accord_id
    WHERE fa.fragrance_id = $1
  ),
  fillers AS (
    SELECT
      a.id,
      a.id AS "accordId",
      a.name,
      a.color,
      0 AS votes,
      false AS "myVote"
    FROM accords a
    WHERE NOT EXISTS (
      SELECT 1
      FROM fragrance_accords fa
      WHERE fa.fragrance_id = $1
        AND fa.accord_id = a.id
    )
  )
  SELECT 
    id, 
    "accordId",
    name, 
    color, 
    votes, 
    "myVote"
  FROM (
    SELECT * FROM actual
    UNION ALL
    SELECT * FROM fillers
  ) x
  ORDER BY votes DESC
  LIMIT $3 
  OFFSET $4
`

export interface AccordsFields {
  id: boolean
  name: boolean
  color: boolean
  votes: boolean
  myVote: boolean
}

interface FragranceAccordsArgs {
  limit?: number | undefined
  offset?: number | undefined
  fill?: boolean | undefined
}

export const accords = async (parent: Fragrance, args: FragranceAccordsArgs, ctx: Context, info: GraphQLResolveInfo): Promise<FragranceAccord[] | null> => {
  const user = ctx.user
  const fragranceId = parent.id

  const {
    limit = 8,
    offset = 0,
    fill = false
  } = args

  if (!fragranceId) return null

  const fields: AccordsFields = graphqlFields(info)
  const userId = user?.id

  const query = fill ? fillQuery() : noFillQuery()
  const values = [fragranceId, userId, limit, offset]

  const result = await ctx.pool.query<FragranceAccord>(query, values)

  const accords = result.rows

  return accords
}
