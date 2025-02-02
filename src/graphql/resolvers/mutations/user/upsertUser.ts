import { Context } from '@src/graphql/schema/context'
import { User } from '@src/graphql/types/userTypes'
import { GraphQLResolveInfo } from 'graphql'

interface UpsertUserArgs {
  email: string
  cognitoId: string
}

export const createUser = async (parent: undefined, args: UpsertUserArgs, ctx: Context, info: GraphQLResolveInfo): Promise<User> => {
  const cogId = args.cognitoId
  const email = args.email

  const res = await ctx.pool.query(`
    INSERT INTO users (cognito_id, email)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO UPDATE
      SET email = EXCLUDED.email
    RETURNING *;
  `, [cogId, email])

  const userRes = res.rows[0]

  const user: User = {
    id: userRes.id,
    email: userRes.email,
    username: userRes.username,
    cognitoId: userRes.cognito_id
  }

  return user
}
