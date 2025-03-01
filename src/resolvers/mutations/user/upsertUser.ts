import { type User, type MutationResolvers } from '@src/generated/gql-types'

const UPSERT_USER_QUERY = `--sql
  INSERT INTO users (email, cognito_id)
  VALUES ($1, $2)
  ON CONFLICT (email)
  DO UPDATE
    SET email = EXCLUDED.email
  RETURNING 
    id,
    email,
    username,
    cognito_id as "cognitoId"
`

export const upsertUser: MutationResolvers['upsertUser'] = async (parent, args, context, info) => {
  const { user, pool } = context
  const { email, cognitoId } = args

  if (user === undefined) return null
  if (user.cognitoId !== cognitoId) return null

  const values = [email, cognitoId]
  const { rows } = await pool.query<User>(UPSERT_USER_QUERY, values)

  return rows.at(0) ?? null
}
