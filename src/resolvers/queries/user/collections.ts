import { type FragranceCollection, type UserResolvers } from '@src/generated/gql-types'

const COLLECTIONS_QUERY = `--sql
  SELECT
    id,
    name
  FROM fragrance_collections
  WHERE user_id = $1
  LIMIT $2
  OFFSET $3
`

export const collections: UserResolvers['collections'] = async (parent, args, context, info) => {
  const { id } = parent
  const { pool } = context
  const { limit = 10, offset = 0 } = args

  const values = [id, limit, offset]
  const { rows } = await pool.query<FragranceCollection>(COLLECTIONS_QUERY, values)
  rows.forEach(collection => { collection.user = parent })

  return rows
}
