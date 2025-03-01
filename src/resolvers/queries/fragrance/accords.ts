import { type FragranceAccord, type FragranceResolvers } from '@src/generated/gql-types'

const noFillQuery = (): string => `--sql
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

const fillQuery = (): string => `--sql
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

export const accords: FragranceResolvers['accords'] = async (parent, args, context, info) => {
  const { id } = parent
  const { limit = 8, offset = 0, fill = false } = args
  const { user, pool } = context

  const query = (fill ?? false) ? fillQuery() : noFillQuery()
  const values = [id, user?.id, limit, offset]
  const { rows } = await pool.query<FragranceAccord>(query, values)

  return rows
}
