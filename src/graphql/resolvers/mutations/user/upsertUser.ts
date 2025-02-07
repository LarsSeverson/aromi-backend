import { Context } from '@src/graphql/schema/context'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'

interface UpsertUserArgs {
  email: string
  cognitoId: string
}

export const upsertUser = async (parent: undefined, args: UpsertUserArgs, ctx: Context, info: GraphQLResolveInfo): Promise<User | null> => {
  const ctxUser = ctx.user
  const { email, cognitoId } = args

  if (!ctxUser) return null

  if (ctxUser.cognitoId !== cognitoId) return null

  const query = `--sql
    INSERT INTO users (email, cognito_id)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO UPDATE
      SET email = EXCLUDED.email
    RETURNING 
      id,
      email,
      username,
      cognito_id AS "cognitoId"
  `

  const res = await ctx.pool.query(query, [email, cognitoId])
  const user = res.rows[0]

  return user || null
}
