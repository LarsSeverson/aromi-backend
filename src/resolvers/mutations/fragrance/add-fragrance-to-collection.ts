import { type FragranceCollection, type MutationResolvers } from '@src/generated/gql-types'

const ADD_FRAGRANCE_TO_COLLECTION_QUERY = /* sql */`
  WITH check_owner AS (
    SELECT *
    FROM fragrance_collections
    WHERE id = $1
      AND user_id = $3
  ),
  insert_fragrance AS (
    INSERT INTO collection_fragrances (collection_id, fragrance_id)
    SELECT id, $2
    FROM check_owner
    RETURNING collection_id
  ),
  update_collection AS (
    UPDATE fragrance_collections
    SET updated_at = now()
    WHERE id = (SELECT collection_id FROM insert_fragrance)
    RETURNING 
      id,
      name,
      updated_at,
      created_at
  )
  SELECT
    id,
    name,
    updated_at AS "dModified",
    created_at AS "dCreated"
  FROM update_collection
`

export const addFragranceToCollection: MutationResolvers['addFragranceToCollection'] = async (parent, args, context, info) => {
  const { user, pool } = context

  if (user == null) return null

  const { collectionId, fragranceId } = args

  const values = [collectionId, fragranceId, user.id]
  const { rows } = await pool.query<FragranceCollection>(ADD_FRAGRANCE_TO_COLLECTION_QUERY, values)

  return rows.at(0) ?? null
}
