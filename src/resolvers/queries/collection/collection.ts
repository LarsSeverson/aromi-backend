import { type QueryResolvers, type FragranceCollection } from '@src/generated/gql-types'

const BASE_QUERY = /* sql */`
  SELECT
    id,
    name,
    created_at AS "dCreated",
    updated_at AS "dModified"
  FROM fragrance_collections
  WHERE id = $1 
`

export const collection: QueryResolvers['collection'] = async (parent, args, context, info) => {
  const { id } = args
  const { sources } = context
  const { db } = sources

  const query = BASE_QUERY
  const values = [id]
  const { rows } = await db.query<FragranceCollection>(query, values)

  return rows.at(0) ?? null
}
