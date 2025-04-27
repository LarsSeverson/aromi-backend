import { type FragranceCollection, type MutationResolvers } from '@src/generated/gql-types'

const CREATE_COLLECTION_QUERY = /* sql */`
  INSERT INTO fragrance_collections (user_id, name)
  VALUES ($1, $2)
  RETURNING 
    id,
    name,
    updated_at AS "dModified",
    created_at AS "dCreated" 
`

export const createCollection: MutationResolvers['createCollection'] = async (parent, args, context, info) => {
  const { input } = args
  const { me: user, sources } = context
  const { db } = sources

  if (user == null) return null

  const { name } = input

  const values = [user.id, name]
  const { rows } = await db.query<FragranceCollection>(CREATE_COLLECTION_QUERY, values)

  if (rows.length === 0) return null

  return {
    ...rows[0],
    user
  }
}
