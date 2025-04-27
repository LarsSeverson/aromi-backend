import { type User, type QueryResolvers } from '@src/generated/gql-types'

const USER_QUERY = /* sql */`
  SELECT 
    id,
    username,
    email,
    cognito_id AS "cognitoId",
    0 AS followers,
    0 AS following
  FROM users
  WHERE id = $1
`

export const user: QueryResolvers['user'] = async (parent, args, context, info) => {
  const { id } = args
  const { sources } = context
  const { db } = sources

  const values = [id]
  const { rows } = await db.query<User>(USER_QUERY, values)

  return rows.at(0) ?? null
}
